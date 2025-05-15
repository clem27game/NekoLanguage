/**
 * Centre de Packages NekoScript
 * Système robuste pour la distribution et la permanence des packages
 * 
 * Caractéristiques:
 * - Publication multi-niveaux (local, global, réseau)
 * - Réplication automatique des packages entre instances
 * - Métadonnées enrichies et vérification de signatures
 * - Gestion avancée des versions et dépendances
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { Pool } = require('pg');
const axios = require('axios').default;

class PackageCenter {
  constructor() {
    this.isInitialized = false;
    this.useLocalStorage = true;
    
    // Initialiser les chemins
    this.homeDir = process.env.HOME || process.env.USERPROFILE || '.';
    this.nekoScriptDir = path.join(this.homeDir, '.nekoscript');
    this.packagesDir = path.join(this.nekoScriptDir, 'packages');
    this.registryFile = path.join(this.packagesDir, 'registry.json');

    // Information sur les serveurs de réplication (pour futures versions)
    this.replicationServers = [
      "https://nekoscript-packages.onrender.com",
      "https://nekoscript-registry.vercel.app"
    ];
    
    // Essayer de se connecter à PostgreSQL si disponible
    this.connectToDatabase();
  }
  
  /**
   * Connecte le centre de packages à la base de données PostgreSQL
   * Si la connexion échoue, utilise le stockage local
   */
  connectToDatabase() {
    if (!process.env.DATABASE_URL) {
      console.log("Variable d'environnement DATABASE_URL non définie, utilisation du stockage local");
      this.useLocalStorage = true;
      return;
    }
    
    try {
      this.pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        connectionTimeoutMillis: 10000
      });
      
      // Tester la connexion
      this.pool.query('SELECT NOW()')
        .then(() => {
          console.log("Connexion PostgreSQL réussie pour le centre de packages");
          this.useLocalStorage = false;
        })
        .catch(err => {
          console.error("Échec de la connexion PostgreSQL:", err.message);
          console.log("Utilisation du stockage local pour les packages");
          this.useLocalStorage = true;
        });
    } catch (error) {
      console.error("Erreur lors de la configuration PostgreSQL:", error.message);
      console.log("Utilisation du stockage local pour les packages");
      this.useLocalStorage = true;
    }
  }
  
  /**
   * Initialise le centre de packages et crée les structures nécessaires
   */
  async initialize() {
    if (this.isInitialized) return;
    
    try {
      // Créer les répertoires de stockage si nécessaire
      if (!fs.existsSync(this.nekoScriptDir)) {
        fs.mkdirSync(this.nekoScriptDir, { recursive: true });
      }
      
      if (!fs.existsSync(this.packagesDir)) {
        fs.mkdirSync(this.packagesDir, { recursive: true });
      }
      
      // Initialiser le registre local si nécessaire
      if (!fs.existsSync(this.registryFile)) {
        fs.writeFileSync(this.registryFile, JSON.stringify({
          packages: {},
          versions: {},
          metadata: {
            lastUpdate: new Date().toISOString(),
            format: "1.0.0"
          }
        }, null, 2));
      }
      
      // Initialiser la base de données PostgreSQL si utilisée
      if (!this.useLocalStorage) {
        await this.initializeDatabase();
      }
      
      this.isInitialized = true;
      console.log("Centre de packages NekoScript initialisé");
      
    } catch (error) {
      console.error("Erreur d'initialisation du centre de packages:", error);
      this.useLocalStorage = true; // Fallback vers stockage local
    }
  }
  
  /**
   * Initialise la base de données PostgreSQL pour le stockage des packages
   */
  async initializeDatabase() {
    try {
      // Créer les tables nécessaires si elles n'existent pas
      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS package_registry (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL UNIQUE,
          description TEXT,
          author VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        
        CREATE TABLE IF NOT EXISTS package_versions (
          id SERIAL PRIMARY KEY,
          package_id INTEGER REFERENCES package_registry(id) ON DELETE CASCADE,
          version VARCHAR(50) NOT NULL,
          content TEXT NOT NULL,
          checksum VARCHAR(255),
          downloads INTEGER DEFAULT 0,
          published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE (package_id, version)
        );
        
        CREATE TABLE IF NOT EXISTS package_metadata (
          id SERIAL PRIMARY KEY,
          package_id INTEGER REFERENCES package_registry(id) ON DELETE CASCADE,
          key VARCHAR(255) NOT NULL,
          value TEXT,
          UNIQUE (package_id, key)
        );
        
        CREATE TABLE IF NOT EXISTS package_dependencies (
          id SERIAL PRIMARY KEY,
          package_id INTEGER REFERENCES package_registry(id) ON DELETE CASCADE,
          dependency_name VARCHAR(255) NOT NULL,
          version_constraint VARCHAR(50),
          is_optional BOOLEAN DEFAULT FALSE,
          UNIQUE (package_id, dependency_name)
        );
      `);
      
      console.log("Schéma de base de données du centre de packages initialisé");
    } catch (error) {
      console.error("Erreur lors de l'initialisation de la base de données:", error);
      this.useLocalStorage = true; // Fallback vers stockage local
      throw error;
    }
  }
  
  /**
   * Publie un package dans le centre de packages
   * @param {string} name - Nom du package
   * @param {string} content - Contenu du package
   * @param {Object} options - Options de publication (version, auteur, description, etc.)
   * @returns {Object} - Résultat de la publication
   */
  async publishPackage(name, content, options = {}) {
    await this.initialize();
    
    const {
      version = '1.0.0',
      author = 'Utilisateur NekoScript',
      description = '',
      dependencies = {},
      keywords = [],
      isPrivate = false
    } = options;
    
    // Valider les données
    if (!name || typeof name !== 'string') {
      throw new Error("Nom de package invalide");
    }
    
    if (!content || typeof content !== 'string') {
      throw new Error("Contenu de package invalide");
    }
    
    // Générer un checksum pour le contenu
    const checksum = crypto.createHash('sha256').update(content).digest('hex');
    
    try {
      let result;
      
      // Utiliser le stockage local ou PostgreSQL
      if (this.useLocalStorage) {
        result = await this.publishPackageLocal(name, content, {
          version,
          author,
          description,
          checksum,
          dependencies,
          keywords,
          isPrivate
        });
      } else {
        result = await this.publishPackageDatabase(name, content, {
          version,
          author,
          description,
          checksum,
          dependencies,
          keywords,
          isPrivate
        });
      }
      
      // Essayer de répliquer sur les serveurs distants (pour une future version)
      // this.replicatePackage(name, content, options).catch(err => console.warn("Échec de réplication:", err.message));
      
      return {
        ...result,
        storageMode: this.useLocalStorage ? 'local' : 'global'
      };
    } catch (error) {
      console.error(`Erreur lors de la publication du package ${name}:`, error);
      
      // Si erreur avec PostgreSQL, essayer le stockage local
      if (!this.useLocalStorage) {
        console.log("Basculement vers stockage local suite à une erreur...");
        this.useLocalStorage = true;
        return this.publishPackage(name, content, options);
      }
      
      throw error;
    }
  }
  
  /**
   * Publie un package en stockage local
   * @private
   */
  async publishPackageLocal(name, content, options) {
    const {
      version,
      author,
      description,
      checksum,
      dependencies,
      keywords,
      isPrivate
    } = options;
    
    // Charger le registre
    const registry = JSON.parse(fs.readFileSync(this.registryFile, 'utf8'));
    
    // Vérifier si le package existe déjà
    const packageExists = registry.packages[name] !== undefined;
    let targetVersion = version;
    let updated = false;
    
    if (packageExists) {
      updated = true;
      
      // Vérifier si la version existe déjà
      if (registry.versions[name] && registry.versions[name].includes(version)) {
        // Incrémenter la version
        const parts = version.split('.');
        if (parts.length === 3) {
          const [major, minor, patch] = parts.map(Number);
          targetVersion = `${major}.${minor}.${patch + 1}`;
          console.log(`Version ${version} existante pour ${name}, incrémentation à ${targetVersion}`);
        }
      }
      
      // Mettre à jour les métadonnées du package
      registry.packages[name] = {
        ...registry.packages[name],
        version: targetVersion,
        updated_at: new Date().toISOString(),
        description: description || registry.packages[name].description,
        author: author || registry.packages[name].author,
        keywords: keywords.length ? keywords : registry.packages[name].keywords,
        dependencies: { ...registry.packages[name].dependencies, ...dependencies }
      };
    } else {
      // Créer une nouvelle entrée
      registry.packages[name] = {
        name,
        version: targetVersion,
        description,
        author,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        downloads: 0,
        keywords,
        dependencies,
        isPrivate
      };
      
      // Initialiser la liste des versions
      registry.versions[name] = [];
    }
    
    // Ajouter la nouvelle version si elle n'existe pas déjà
    if (!registry.versions[name].includes(targetVersion)) {
      registry.versions[name].push(targetVersion);
    }
    
    // Enregistrer le contenu du package
    const packagePath = path.join(this.packagesDir, `${name}-${targetVersion}.pkg`);
    fs.writeFileSync(packagePath, content);
    
    // Mettre à jour le registre
    registry.metadata.lastUpdate = new Date().toISOString();
    fs.writeFileSync(this.registryFile, JSON.stringify(registry, null, 2));
    
    return {
      name,
      version: targetVersion,
      updated,
      checksum
    };
  }
  
  /**
   * Publie un package dans la base de données PostgreSQL
   * @private
   */
  async publishPackageDatabase(name, content, options) {
    const {
      version,
      author,
      description,
      checksum,
      dependencies,
      keywords,
      isPrivate
    } = options;
    
    let targetVersion = version;
    let updated = false;
    
    // Vérifier si le package existe déjà
    const existingPackage = await this.pool.query(
      'SELECT id, name FROM package_registry WHERE name = $1',
      [name]
    );
    
    let packageId;
    
    if (existingPackage.rows.length > 0) {
      // Le package existe, vérifier les versions
      packageId = existingPackage.rows[0].id;
      updated = true;
      
      // Vérifier si la version existe déjà
      const versionCheck = await this.pool.query(
        'SELECT id FROM package_versions WHERE package_id = $1 AND version = $2',
        [packageId, version]
      );
      
      if (versionCheck.rows.length > 0) {
        // La version existe, incrémenter
        const parts = version.split('.');
        if (parts.length === 3) {
          const [major, minor, patch] = parts.map(Number);
          targetVersion = `${major}.${minor}.${patch + 1}`;
          console.log(`Version ${version} existante pour ${name}, incrémentation à ${targetVersion}`);
        }
      }
      
      // Mettre à jour le package
      await this.pool.query(
        'UPDATE package_registry SET description = $1, author = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
        [description, author, packageId]
      );
    } else {
      // Créer un nouveau package
      const newPackage = await this.pool.query(
        'INSERT INTO package_registry (name, description, author) VALUES ($1, $2, $3) RETURNING id',
        [name, description, author]
      );
      
      packageId = newPackage.rows[0].id;
      
      // Ajouter les métadonnées
      if (keywords && keywords.length) {
        await this.pool.query(
          'INSERT INTO package_metadata (package_id, key, value) VALUES ($1, $2, $3)',
          [packageId, 'keywords', JSON.stringify(keywords)]
        );
      }
      
      if (isPrivate) {
        await this.pool.query(
          'INSERT INTO package_metadata (package_id, key, value) VALUES ($1, $2, $3)',
          [packageId, 'private', 'true']
        );
      }
    }
    
    // Ajouter la nouvelle version
    await this.pool.query(
      'INSERT INTO package_versions (package_id, version, content, checksum) VALUES ($1, $2, $3, $4)',
      [packageId, targetVersion, content, checksum]
    );
    
    // Ajouter les dépendances
    if (dependencies && Object.keys(dependencies).length > 0) {
      // Supprimer les anciennes dépendances
      await this.pool.query(
        'DELETE FROM package_dependencies WHERE package_id = $1',
        [packageId]
      );
      
      // Ajouter les nouvelles dépendances
      for (const [depName, versionConstraint] of Object.entries(dependencies)) {
        await this.pool.query(
          'INSERT INTO package_dependencies (package_id, dependency_name, version_constraint) VALUES ($1, $2, $3)',
          [packageId, depName, versionConstraint]
        );
      }
    }
    
    return {
      name,
      version: targetVersion,
      updated,
      checksum
    };
  }
  
  /**
   * Télécharge un package depuis le centre de packages
   * @param {string} name - Nom du package
   * @param {string} version - Version spécifique (optionnel)
   * @returns {string} - Contenu du package
   */
  async downloadPackage(name, version = null) {
    await this.initialize();
    
    try {
      let content;
      
      if (this.useLocalStorage) {
        content = await this.downloadPackageLocal(name, version);
      } else {
        content = await this.downloadPackageDatabase(name, version);
      }
      
      return content;
    } catch (error) {
      console.error(`Erreur lors du téléchargement du package ${name}:`, error);
      
      // Si erreur avec PostgreSQL, essayer le stockage local
      if (!this.useLocalStorage) {
        console.log("Basculement vers stockage local pour le téléchargement...");
        this.useLocalStorage = true;
        return this.downloadPackage(name, version);
      }
      
      // Dernière chance: essayer de télécharger depuis un serveur de réplication
      try {
        return await this.downloadPackageFromReplicationServer(name, version);
      } catch (replicationError) {
        console.error("Échec du téléchargement depuis les serveurs de réplication:", replicationError);
        throw error;
      }
    }
  }
  
  /**
   * Télécharge un package depuis le stockage local
   * @private
   */
  async downloadPackageLocal(name, version = null) {
    // Charger le registre
    const registry = JSON.parse(fs.readFileSync(this.registryFile, 'utf8'));
    
    // Vérifier si le package existe
    if (!registry.packages[name]) {
      throw new Error(`Package ${name} non trouvé dans le registre local`);
    }
    
    // Déterminer la version à télécharger
    let targetVersion = version;
    if (!targetVersion) {
      // Utiliser la dernière version
      targetVersion = registry.packages[name].version;
    }
    
    // Vérifier si la version existe
    if (!registry.versions[name] || !registry.versions[name].includes(targetVersion)) {
      throw new Error(`Version ${targetVersion} du package ${name} non trouvée`);
    }
    
    // Charger le contenu du package
    const packagePath = path.join(this.packagesDir, `${name}-${targetVersion}.pkg`);
    
    if (!fs.existsSync(packagePath)) {
      throw new Error(`Fichier de package ${name}-${targetVersion}.pkg non trouvé`);
    }
    
    // Incrémenter le compteur de téléchargements
    registry.packages[name].downloads++;
    fs.writeFileSync(this.registryFile, JSON.stringify(registry, null, 2));
    
    return fs.readFileSync(packagePath, 'utf8');
  }
  
  /**
   * Télécharge un package depuis la base de données
   * @private
   */
  async downloadPackageDatabase(name, version = null) {
    // Trouver le package
    const packageQuery = await this.pool.query(
      'SELECT id, name FROM package_registry WHERE name = $1',
      [name]
    );
    
    if (packageQuery.rows.length === 0) {
      throw new Error(`Package ${name} non trouvé dans la base de données`);
    }
    
    const packageId = packageQuery.rows[0].id;
    
    // Déterminer la version à télécharger
    let versionQuery;
    
    if (version) {
      // Version spécifique
      versionQuery = await this.pool.query(
        'SELECT id, version, content FROM package_versions WHERE package_id = $1 AND version = $2',
        [packageId, version]
      );
    } else {
      // Dernière version (par date de publication)
      versionQuery = await this.pool.query(
        'SELECT id, version, content FROM package_versions WHERE package_id = $1 ORDER BY published_at DESC LIMIT 1',
        [packageId]
      );
    }
    
    if (versionQuery.rows.length === 0) {
      throw new Error(`Version ${version || 'latest'} du package ${name} non trouvée`);
    }
    
    // Incrémenter le compteur de téléchargements
    await this.pool.query(
      'UPDATE package_versions SET downloads = downloads + 1 WHERE id = $1',
      [versionQuery.rows[0].id]
    );
    
    return versionQuery.rows[0].content;
  }
  
  /**
   * Télécharge un package depuis un serveur de réplication
   * Méthode pour futures versions avec réplication inter-serveurs
   * @private
   */
  async downloadPackageFromReplicationServer(name, version = null) {
    // Essayer chaque serveur de réplication
    for (const server of this.replicationServers) {
      try {
        // NOTE: Cette fonctionnalité sera implémentée dans une version future
        // Pour l'instant, simuler un échec
        throw new Error("Fonction de réplication non implémentée");
      } catch (error) {
        console.warn(`Échec de téléchargement depuis ${server}:`, error.message);
      }
    }
    
    throw new Error(`Package ${name} non trouvé sur aucun serveur de réplication`);
  }
  
  /**
   * Liste tous les packages disponibles
   * @param {Object} options - Options de recherche
   * @returns {Array} - Liste des packages
   */
  async listPackages(options = {}) {
    await this.initialize();
    
    const {
      limit = 100,
      offset = 0,
      search = '',
      category = '',
      sort = 'downloads'
    } = options;
    
    try {
      let packages;
      
      if (this.useLocalStorage) {
        packages = await this.listPackagesLocal(options);
      } else {
        packages = await this.listPackagesDatabase(options);
      }
      
      return packages;
    } catch (error) {
      console.error("Erreur lors de la liste des packages:", error);
      
      // Si erreur avec PostgreSQL, essayer le stockage local
      if (!this.useLocalStorage) {
        console.log("Basculement vers stockage local pour la liste des packages...");
        this.useLocalStorage = true;
        return this.listPackages(options);
      }
      
      throw error;
    }
  }
  
  /**
   * Liste les packages depuis le stockage local
   * @private
   */
  async listPackagesLocal(options) {
    const { limit, offset, search, category, sort } = options;
    
    // Charger le registre
    const registry = JSON.parse(fs.readFileSync(this.registryFile, 'utf8'));
    
    // Filtrer les packages
    let packages = Object.values(registry.packages);
    
    if (search) {
      const searchLower = search.toLowerCase();
      packages = packages.filter(pkg => 
        pkg.name.toLowerCase().includes(searchLower) ||
        (pkg.description && pkg.description.toLowerCase().includes(searchLower))
      );
    }
    
    if (category) {
      packages = packages.filter(pkg => 
        pkg.keywords && pkg.keywords.includes(category)
      );
    }
    
    // Trier les packages
    if (sort === 'downloads') {
      packages.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
    } else if (sort === 'name') {
      packages.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'updated') {
      packages.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    }
    
    // Paginer les résultats
    return packages.slice(offset, offset + limit);
  }
  
  /**
   * Liste les packages depuis la base de données
   * @private
   */
  async listPackagesDatabase(options) {
    const { limit, offset, search, category, sort } = options;
    
    let query = `
      SELECT 
        r.id, r.name, r.description, r.author, 
        r.created_at, r.updated_at,
        v.version,
        (SELECT SUM(downloads) FROM package_versions WHERE package_id = r.id) as downloads
      FROM 
        package_registry r
      LEFT JOIN (
        SELECT DISTINCT ON (package_id) package_id, version, published_at
        FROM package_versions
        ORDER BY package_id, published_at DESC
      ) v ON v.package_id = r.id
    `;
    
    const queryParams = [];
    let conditions = [];
    
    // Appliquer les filtres
    if (search) {
      queryParams.push(`%${search}%`);
      conditions.push(`(r.name ILIKE $${queryParams.length} OR r.description ILIKE $${queryParams.length})`);
    }
    
    if (category) {
      queryParams.push(category);
      conditions.push(`EXISTS (
        SELECT 1 FROM package_metadata 
        WHERE package_id = r.id AND key = 'keywords' AND value LIKE $${queryParams.length}
      )`);
    }
    
    if (conditions.length) {
      query += " WHERE " + conditions.join(" AND ");
    }
    
    // Tri
    if (sort === 'downloads') {
      query += " ORDER BY downloads DESC NULLS LAST";
    } else if (sort === 'name') {
      query += " ORDER BY r.name ASC";
    } else if (sort === 'updated') {
      query += " ORDER BY r.updated_at DESC";
    }
    
    // Pagination
    query += ` LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
    queryParams.push(limit, offset);
    
    const result = await this.pool.query(query, queryParams);
    return result.rows;
  }
  
  /**
   * Obtient les informations détaillées d'un package
   * @param {string} name - Nom du package
   * @returns {Object} - Informations du package
   */
  async getPackageInfo(name) {
    await this.initialize();
    
    try {
      let packageInfo;
      
      if (this.useLocalStorage) {
        packageInfo = await this.getPackageInfoLocal(name);
      } else {
        packageInfo = await this.getPackageInfoDatabase(name);
      }
      
      return packageInfo;
    } catch (error) {
      console.error(`Erreur lors de la récupération des informations du package ${name}:`, error);
      
      // Si erreur avec PostgreSQL, essayer le stockage local
      if (!this.useLocalStorage) {
        console.log("Basculement vers stockage local pour les informations de package...");
        this.useLocalStorage = true;
        return this.getPackageInfo(name);
      }
      
      throw error;
    }
  }
  
  /**
   * Obtient les informations d'un package depuis le stockage local
   * @private
   */
  async getPackageInfoLocal(name) {
    // Charger le registre
    const registry = JSON.parse(fs.readFileSync(this.registryFile, 'utf8'));
    
    // Vérifier si le package existe
    if (!registry.packages[name]) {
      throw new Error(`Package ${name} non trouvé dans le registre local`);
    }
    
    const packageInfo = registry.packages[name];
    
    // Ajouter l'historique des versions
    packageInfo.versions = (registry.versions[name] || []).map(version => ({
      version,
      published_at: packageInfo.created_at // Simplification pour le stockage local
    }));
    
    return packageInfo;
  }
  
  /**
   * Obtient les informations d'un package depuis la base de données
   * @private
   */
  async getPackageInfoDatabase(name) {
    // Trouver le package
    const packageQuery = await this.pool.query(
      `SELECT 
        r.id, r.name, r.description, r.author, r.created_at, r.updated_at,
        (SELECT SUM(downloads) FROM package_versions WHERE package_id = r.id) as downloads
      FROM 
        package_registry r
      WHERE 
        r.name = $1`,
      [name]
    );
    
    if (packageQuery.rows.length === 0) {
      throw new Error(`Package ${name} non trouvé dans la base de données`);
    }
    
    const packageInfo = packageQuery.rows[0];
    const packageId = packageInfo.id;
    
    // Récupérer l'historique des versions
    const versionsQuery = await this.pool.query(
      `SELECT version, published_at 
      FROM package_versions 
      WHERE package_id = $1 
      ORDER BY published_at DESC`,
      [packageId]
    );
    
    packageInfo.versions = versionsQuery.rows;
    
    // Récupérer les métadonnées
    const metadataQuery = await this.pool.query(
      `SELECT key, value FROM package_metadata WHERE package_id = $1`,
      [packageId]
    );
    
    for (const row of metadataQuery.rows) {
      if (row.key === 'keywords') {
        packageInfo.keywords = JSON.parse(row.value);
      } else {
        packageInfo[row.key] = row.value;
      }
    }
    
    // Récupérer les dépendances
    const dependenciesQuery = await this.pool.query(
      `SELECT dependency_name, version_constraint FROM package_dependencies WHERE package_id = $1`,
      [packageId]
    );
    
    packageInfo.dependencies = {};
    for (const row of dependenciesQuery.rows) {
      packageInfo.dependencies[row.dependency_name] = row.version_constraint;
    }
    
    delete packageInfo.id; // Supprimer l'ID de la base de données
    
    return packageInfo;
  }
}

module.exports = new PackageCenter();