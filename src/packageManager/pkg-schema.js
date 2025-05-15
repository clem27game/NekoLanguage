/**
 * Schéma de base de données pour le gestionnaire de packages NekoScript
 * Utilise PostgreSQL pour stocker les packages de manière permanente
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

class PackageDatabase {
  constructor() {
    // Utiliser un système de fallback pour gérer les environnements sans PostgreSQL
    this.useLocalStorage = !process.env.DATABASE_URL;
    
    // Stockage local des packages en mémoire ou dans des fichiers si PostgreSQL n'est pas disponible
    this.localPackages = {};
    this.localPackageVersions = {};
    
    // Initialiser la connexion PostgreSQL seulement si disponible
    if (!this.useLocalStorage) {
      try {
        this.pool = new Pool({
          connectionString: process.env.DATABASE_URL,
          // Augmenter le délai d'attente pour la connexion
          connectionTimeoutMillis: 5000,
        });
      } catch (error) {
        console.warn("Impossible de se connecter à PostgreSQL. Utilisation du stockage local.");
        this.useLocalStorage = true;
      }
    }
    
    this.initialized = false;
    
    // Répertoire de stockage local des packages
    this.packageDir = path.join(process.env.HOME || process.env.USERPROFILE || ".", ".nekoscript", "packages");
    
    // Créer le répertoire si nécessaire
    if (this.useLocalStorage && !fs.existsSync(this.packageDir)) {
      try {
        fs.mkdirSync(this.packageDir, { recursive: true });
      } catch (error) {
        console.error("Erreur lors de la création du répertoire de packages:", error);
      }
    }
  }

  /**
   * Initialise la base de données ou le stockage local
   */
  async initialize() {
    if (this.initialized) return;
    
    // Si nous utilisons le stockage local, charger les packages existants
    if (this.useLocalStorage) {
      try {
        // Charger les métadonnées des packages si le fichier existe
        const indexPath = path.join(this.packageDir, 'index.json');
        
        if (fs.existsSync(indexPath)) {
          const indexData = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
          this.localPackages = indexData.packages || {};
          this.localPackageVersions = indexData.versions || {};
        }
        
        console.log('Stockage local des packages initialisé avec succès.');
        this.initialized = true;
        return;
      } catch (error) {
        console.warn('Erreur lors de l\'initialisation du stockage local, création d\'un nouveau:', error);
        this.localPackages = {};
        this.localPackageVersions = {};
        this.initialized = true;
        return;
      }
    }
    
    // Si nous utilisons PostgreSQL
    try {
      // Vérifier la connexion avant de créer les tables
      const testConnection = await this.pool.query('SELECT NOW()').catch(err => {
        console.error('Erreur de connexion PostgreSQL:', err);
        throw new Error(`Impossible de se connecter à PostgreSQL: ${err.message}`);
      });
      
      // Création des tables nécessaires
      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS packages (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL UNIQUE,
          version VARCHAR(50) NOT NULL,
          author VARCHAR(255) NOT NULL,
          description TEXT,
          content TEXT NOT NULL,
          language VARCHAR(50) NOT NULL,
          downloads INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        
        CREATE TABLE IF NOT EXISTS package_versions (
          id SERIAL PRIMARY KEY,
          package_id INTEGER REFERENCES packages(id) ON DELETE CASCADE,
          version VARCHAR(50) NOT NULL,
          content TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE (package_id, version)
        );
        
        CREATE TABLE IF NOT EXISTS package_dependencies (
          id SERIAL PRIMARY KEY,
          package_id INTEGER REFERENCES packages(id) ON DELETE CASCADE,
          dependency_name VARCHAR(255) NOT NULL,
          dependency_version VARCHAR(50),
          UNIQUE (package_id, dependency_name)
        );
      `);
      
      console.log('Base de données PostgreSQL des packages initialisée avec succès.');
      this.initialized = true;
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de la base de données PostgreSQL:', error);
      
      // Passer en mode stockage local en cas d'erreur PostgreSQL
      console.log('Basculement vers le stockage local des packages...');
      this.useLocalStorage = true;
      this.localPackages = {};
      this.localPackageVersions = {};
      this.initialized = true;
    }
  }

  /**
   * Publie un package dans la base de données ou en stockage local
   */
  async publishPackage(packageName, packageContent, language, options = {}) {
    await this.initialize();
    
    const { version = '1.0.0', author = 'Utilisateur NekoScript', description = '' } = options;
    
    // Validation du format de version
    if (version !== '0.0.0') {
      const versionParts = version.split('.');
      if (versionParts.length !== 3 || versionParts.some(part => isNaN(Number(part)))) {
        throw new Error(`Format de version invalide: ${version}. Utilisez le format majeur.mineur.correctif (ex: 1.0.0)`);
      }
    }
    
    // Si nous utilisons le stockage local
    if (this.useLocalStorage) {
      try {
        // Date actuelle en ISO format
        const currentDate = new Date().toISOString();
        const packageFilePath = path.join(this.packageDir, `${packageName}.pkg`);
        
        // Vérifier si le package existe déjà
        let targetVersion = version;
        let isUpdate = false;
        
        if (this.localPackages[packageName]) {
          isUpdate = true;
          // Vérifier si la version existe déjà
          const existingVersions = this.localPackageVersions[packageName] || [];
          if (existingVersions.includes(version) && version !== '0.0.0') {
            // La version existe déjà, incrémenter automatiquement
            const versionParts = version.split('.');
            let [major, minor, patch] = versionParts.map(Number);
            patch++;
            targetVersion = `${major}.${minor}.${patch}`;
            console.log(`La version ${version} existe déjà. Incrémentation automatique à ${targetVersion}`);
          }
        }
        
        // Sauvegarder le contenu du package
        fs.writeFileSync(packageFilePath, packageContent);
        
        // Mettre à jour les métadonnées
        this.localPackages[packageName] = {
          name: packageName,
          version: targetVersion,
          author,
          description,
          language,
          downloads: this.localPackages[packageName]?.downloads || 0,
          created_at: this.localPackages[packageName]?.created_at || currentDate,
          updated_at: currentDate
        };
        
        // Mettre à jour les versions
        if (!this.localPackageVersions[packageName]) {
          this.localPackageVersions[packageName] = [];
        }
        
        if (!this.localPackageVersions[packageName].includes(targetVersion)) {
          this.localPackageVersions[packageName].push(targetVersion);
        }
        
        // Sauvegarder l'index des packages
        const indexPath = path.join(this.packageDir, 'index.json');
        fs.writeFileSync(indexPath, JSON.stringify({
          packages: this.localPackages,
          versions: this.localPackageVersions
        }, null, 2));
        
        return { packageName, version: targetVersion, updated: isUpdate };
      } catch (error) {
        console.error(`Erreur lors de la publication locale du package ${packageName}:`, error);
        throw error;
      }
    }
    
    // Si nous utilisons PostgreSQL
    try {
      // Vérifie si le package existe déjà
      const existingPackageResult = await this.pool.query(
        'SELECT id FROM packages WHERE name = $1',
        [packageName]
      );
      
      if (existingPackageResult.rows.length > 0) {
        // Mise à jour du package existant
        const packageId = existingPackageResult.rows[0].id;
        
        // Vérifier si la version existe déjà pour ce package
        const versionCheckResult = await this.pool.query(
          'SELECT id FROM package_versions WHERE package_id = $1 AND version = $2',
          [packageId, version]
        );
        
        let targetVersion = version;
        
        if (versionCheckResult.rows.length > 0 && version !== '0.0.0') {
          // La version existe déjà, incrémenter automatiquement le numéro de version
          const versionParts = version.split('.');
          
          // Incrémenter le dernier nombre (correctif)
          let [major, minor, patch] = versionParts.map(Number);
          patch++;
          targetVersion = `${major}.${minor}.${patch}`;
          console.log(`La version ${version} existe déjà. Incrémentation automatique à ${targetVersion}`);
        }
        
        // Insertion d'une nouvelle version
        await this.pool.query(
          'INSERT INTO package_versions (package_id, version, content) VALUES ($1, $2, $3) ON CONFLICT (package_id, version) DO UPDATE SET content = $3',
          [packageId, targetVersion, packageContent]
        );
        
        // Mise à jour des informations générales du package
        await this.pool.query(
          'UPDATE packages SET version = $1, description = $2, content = $3, language = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5',
          [targetVersion, description || '', packageContent, language, packageId]
        );
        
        return { packageName, version: targetVersion, updated: true };
      } else {
        // Insertion d'un nouveau package
        const newPackageResult = await this.pool.query(
          'INSERT INTO packages (name, version, author, description, content, language) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
          [packageName, version, author || 'Utilisateur NekoScript', description || '', packageContent, language]
        );
        
        const packageId = newPackageResult.rows[0].id;
        
        // Insertion dans la table des versions
        await this.pool.query(
          'INSERT INTO package_versions (package_id, version, content) VALUES ($1, $2, $3)',
          [packageId, version, packageContent]
        );
        
        return { packageName, version, updated: false };
      }
    } catch (error) {
      // Si erreur PostgreSQL, essayer le stockage local
      console.error(`Erreur lors de la publication PostgreSQL du package ${packageName}:`, error);
      
      // Passer en mode stockage local et réessayer
      console.log('Tentative de publication en stockage local après échec PostgreSQL...');
      this.useLocalStorage = true;
      return this.publishPackage(packageName, packageContent, language, options);
    }
  }

  /**
   * Récupère les informations d'un package
   */
  async getPackageInfo(packageName) {
    await this.initialize();
    
    // Si nous utilisons le stockage local
    if (this.useLocalStorage) {
      try {
        // Vérifier si le package existe
        if (!this.localPackages[packageName]) {
          return null;
        }
        
        // Récupérer les informations du package
        const packageInfo = this.localPackages[packageName];
        
        // Ajouter l'historique des versions
        const versions = this.localPackageVersions[packageName] || [];
        packageInfo.versions = versions.map(version => ({
          version,
          created_at: packageInfo.created_at
        }));
        
        return packageInfo;
      } catch (error) {
        console.error(`Erreur lors de la récupération locale des informations du package ${packageName}:`, error);
        return null;
      }
    }
    
    // Si nous utilisons PostgreSQL
    try {
      const result = await this.pool.query(
        'SELECT id, name, version, author, description, language, downloads, created_at, updated_at FROM packages WHERE name = $1',
        [packageName]
      );
      
      if (result.rows.length === 0) {
        return null;
      }
      
      // Récupérer également l'historique des versions
      const packageId = result.rows[0].id;
      const versionsResult = await this.pool.query(
        'SELECT version, created_at FROM package_versions WHERE package_id = $1 ORDER BY created_at DESC',
        [packageId]
      );
      
      // Ajouter l'historique des versions aux informations du package
      result.rows[0].versions = versionsResult.rows;
      
      return result.rows[0];
    } catch (error) {
      console.error(`Erreur lors de la récupération PostgreSQL des informations du package ${packageName}:`, error);
      
      // En cas d'erreur PostgreSQL, passer au stockage local
      console.log('Tentative de récupération en stockage local après échec PostgreSQL...');
      this.useLocalStorage = true;
      return this.getPackageInfo(packageName);
    }
  }

  /**
   * Télécharge un package
   */
  async downloadPackage(packageName, version = null) {
    await this.initialize();
    
    // Si nous utilisons le stockage local
    if (this.useLocalStorage) {
      try {
        // Vérifier si le package existe
        if (!this.localPackages[packageName]) {
          console.error(`Package local ${packageName} non trouvé.`);
          return null;
        }
        
        // Utiliser la version spécifiée ou la dernière version disponible
        const availableVersions = this.localPackageVersions[packageName] || [];
        if (availableVersions.length === 0) {
          console.error(`Aucune version disponible pour le package local ${packageName}.`);
          return null;
        }
        
        const targetVersion = version || this.localPackages[packageName].version;
        
        // Vérifier si la version demandée existe
        if (version && !availableVersions.includes(version)) {
          console.error(`Version ${version} du package local ${packageName} non trouvée.`);
          return null;
        }
        
        // Lire le contenu du package
        const packageFilePath = path.join(this.packageDir, `${packageName}.pkg`);
        if (!fs.existsSync(packageFilePath)) {
          console.error(`Fichier du package local ${packageName} introuvable.`);
          return null;
        }
        
        const content = fs.readFileSync(packageFilePath, 'utf8');
        
        // Incrémenter le compteur de téléchargements
        this.localPackages[packageName].downloads = (this.localPackages[packageName].downloads || 0) + 1;
        
        // Mettre à jour le fichier d'index
        const indexPath = path.join(this.packageDir, 'index.json');
        fs.writeFileSync(indexPath, JSON.stringify({
          packages: this.localPackages,
          versions: this.localPackageVersions
        }, null, 2));
        
        return content;
      } catch (error) {
        console.error(`Erreur lors du téléchargement du package local ${packageName}:`, error);
        return null;
      }
    }
    
    // Si nous utilisons PostgreSQL
    try {
      let query, params;
      
      // Si une version spécifique est demandée
      if (version) {
        query = `
          SELECT pv.content 
          FROM package_versions pv
          JOIN packages p ON p.id = pv.package_id
          WHERE p.name = $1 AND pv.version = $2
        `;
        params = [packageName, version];
      } else {
        // Sinon on récupère la dernière version
        query = 'SELECT content FROM packages WHERE name = $1';
        params = [packageName];
      }
      
      const result = await this.pool.query(query, params);
      
      if (result.rows.length === 0) {
        console.error(`Package PostgreSQL ${packageName} non trouvé.`);
        
        // Si le package n'est pas trouvé, essayer le stockage local
        this.useLocalStorage = true;
        return this.downloadPackage(packageName, version);
      }
      
      // Incrémenter le compteur de téléchargements
      await this.pool.query(
        'UPDATE packages SET downloads = downloads + 1 WHERE name = $1',
        [packageName]
      );
      
      return result.rows[0].content;
    } catch (error) {
      console.error(`Erreur lors du téléchargement du package PostgreSQL ${packageName}:`, error);
      
      // En cas d'erreur PostgreSQL, passer au stockage local
      console.log('Tentative de téléchargement en stockage local après échec PostgreSQL...');
      this.useLocalStorage = true;
      return this.downloadPackage(packageName, version);
    }
  }

  /**
   * Récupère la liste des packages disponibles
   */
  async listPackages(limit = 100, offset = 0, searchTerm = '') {
    await this.initialize();
    
    try {
      let query, params;
      
      if (searchTerm) {
        query = `
          SELECT name, version, author, description, language, downloads, created_at, updated_at 
          FROM packages 
          WHERE name ILIKE $1 OR description ILIKE $1
          ORDER BY downloads DESC, name ASC
          LIMIT $2 OFFSET $3
        `;
        params = [`%${searchTerm}%`, limit, offset];
      } else {
        query = `
          SELECT name, version, author, description, language, downloads, created_at, updated_at 
          FROM packages 
          ORDER BY downloads DESC, name ASC
          LIMIT $1 OFFSET $2
        `;
        params = [limit, offset];
      }
      
      const result = await this.pool.query(query, params);
      
      return result.rows;
    } catch (error) {
      console.error('Erreur lors de la récupération de la liste des packages:', error);
      throw error;
    }
  }
}

module.exports = new PackageDatabase();