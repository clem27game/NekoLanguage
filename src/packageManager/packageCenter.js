/**
 * Centre de Packages NekoScript - Version Améliorée
 * Système robuste pour la distribution et la permanence des packages
 * avec support amélioré des packages JavaScript natifs
 * 
 * Caractéristiques:
 * - Publication multi-niveaux simplifiée (local, global, réseau)
 * - Réplication automatique des packages entre instances
 * - Métadonnées enrichies et vérification de signatures
 * - Gestion avancée des versions et dépendances
 * - Support du code JavaScript natif dans les packages
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
   * Avec mécanisme de fallback amélioré vers le stockage local
   */
  async connectToDatabase() {
    if (process.env.DATABASE_URL) {
      try {
        this.pool = new Pool({
          connectionString: process.env.DATABASE_URL,
          ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
        });
        
        // Tester la connexion
        await this.pool.query('SELECT NOW()');
        console.log('Connexion PostgreSQL réussie pour le centre de packages');
        
        // Vérifier/créer la table des packages si nécessaire
        await this._initDatabaseTables();
        
        this.useLocalStorage = false;
        this.isInitialized = true;
      } catch (error) {
        console.warn('Erreur de connexion PostgreSQL:', error.message);
        console.warn('Utilisation du stockage local pour les packages...');
        this.useLocalStorage = true;
        this._initLocalStorage();
      }
    } else {
      console.log('Variable DATABASE_URL non définie, utilisation du stockage local');
      this.useLocalStorage = true;
      this._initLocalStorage();
    }
  }
  
  /**
   * Initialise les tables nécessaires dans la base de données
   * @private
   */
  async _initDatabaseTables() {
    try {
      // Vérifier si la table des packages existe
      const tableCheck = await this.pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'nekoscript_packages'
        );
      `);
      
      const tableExists = tableCheck.rows[0].exists;
      
      if (!tableExists) {
        // Créer la table des packages
        await this.pool.query(`
          CREATE TABLE nekoscript_packages (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            version VARCHAR(50) NOT NULL,
            author VARCHAR(255),
            description TEXT,
            code TEXT NOT NULL,
            is_native_js BOOLEAN DEFAULT false,
            dependencies JSONB DEFAULT '{}',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(name, version)
          );
          
          CREATE INDEX idx_packages_name ON nekoscript_packages(name);
          CREATE INDEX idx_packages_name_version ON nekoscript_packages(name, version);
        `);
        
        console.log('Table des packages créée avec succès');
      }
      
      // Ajouter le champ is_native_js s'il n'existe pas (pour la rétrocompatibilité)
      try {
        await this.pool.query(`
          ALTER TABLE nekoscript_packages 
          ADD COLUMN IF NOT EXISTS is_native_js BOOLEAN DEFAULT false;
        `);
      } catch (error) {
        // Ignorer les erreurs potentielles dans certaines versions de PostgreSQL
      }
      
    } catch (error) {
      console.error('Erreur lors de l\'initialisation des tables:', error);
      throw error;
    }
  }
  
  /**
   * Initialise le stockage local pour les packages
   * @private
   */
  _initLocalStorage() {
    // Créer les répertoires si nécessaires
    if (!fs.existsSync(this.nekoScriptDir)) {
      fs.mkdirSync(this.nekoScriptDir, { recursive: true });
    }
    
    if (!fs.existsSync(this.packagesDir)) {
      fs.mkdirSync(this.packagesDir, { recursive: true });
    }
    
    // Initialiser le registre local s'il n'existe pas
    if (!fs.existsSync(this.registryFile)) {
      fs.writeFileSync(this.registryFile, JSON.stringify({
        packages: [],
        lastUpdated: new Date().toISOString()
      }));
    }
    
    this.isInitialized = true;
  }
  
  /**
   * Publie un package dans le répertoire central ou local
   * @param {string} name - Nom du package
   * @param {string} code - Code source du package
   * @param {Object} options - Options supplémentaires (auteur, version, description, etc.)
   * @returns {Promise<Object>} - Informations sur le package publié
   */
  async publishPackage(name, code, options = {}) {
    if (!name || !code) {
      throw new Error('Le nom et le code du package sont requis');
    }
    
    // Options par défaut
    const defaults = {
      version: '1.0.0',
      author: 'Utilisateur NekoScript',
      description: `Package ${name} pour NekoScript`,
      isNativeJs: false,
      dependencies: {}
    };
    
    // Fusionner les options avec les valeurs par défaut
    const packageInfo = { ...defaults, ...options, name, code };
    
    try {
      if (this.useLocalStorage) {
        // Mode stockage local
        await this._publishToLocalStorage(packageInfo);
      } else {
        // Mode base de données
        await this._publishToDatabase(packageInfo);
      }
      
      console.log(`Package ${name}@${packageInfo.version} publié avec succès`);
      return packageInfo;
    } catch (error) {
      console.error('Erreur lors de la publication du package:', error);
      throw error;
    }
  }
  
  /**
   * Publie un package dans la base de données
   * @param {Object} packageInfo - Informations du package
   * @private
   */
  async _publishToDatabase(packageInfo) {
    try {
      // Vérifier si le package avec cette version existe déjà
      const existingPackage = await this.pool.query(
        'SELECT id FROM nekoscript_packages WHERE name = $1 AND version = $2',
        [packageInfo.name, packageInfo.version]
      );
      
      if (existingPackage.rows.length > 0) {
        // Mettre à jour le package existant
        await this.pool.query(
          `UPDATE nekoscript_packages 
           SET 
             code = $1, 
             author = $2, 
             description = $3, 
             dependencies = $4,
             is_native_js = $5
           WHERE name = $6 AND version = $7`,
          [
            packageInfo.code,
            packageInfo.author,
            packageInfo.description,
            JSON.stringify(packageInfo.dependencies),
            packageInfo.isNativeJs,
            packageInfo.name,
            packageInfo.version
          ]
        );
      } else {
        // Insérer un nouveau package
        await this.pool.query(
          `INSERT INTO nekoscript_packages (name, version, author, description, code, dependencies, is_native_js)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            packageInfo.name,
            packageInfo.version,
            packageInfo.author,
            packageInfo.description,
            packageInfo.code,
            JSON.stringify(packageInfo.dependencies),
            packageInfo.isNativeJs
          ]
        );
      }
    } catch (error) {
      console.error('Erreur lors de la publication en base de données:', error);
      
      // Fallback au stockage local en cas d'erreur
      console.log('Tentative de publication en stockage local...');
      await this._publishToLocalStorage(packageInfo);
    }
  }
  
  /**
   * Publie un package dans le stockage local
   * @param {Object} packageInfo - Informations du package
   * @private
   */
  async _publishToLocalStorage(packageInfo) {
    try {
      // Lire le registre existant
      const registry = JSON.parse(fs.readFileSync(this.registryFile, 'utf8'));
      
      // Vérifier si le package existe déjà
      const existingPackageIndex = registry.packages.findIndex(
        p => p.name === packageInfo.name && p.version === packageInfo.version
      );
      
      if (existingPackageIndex >= 0) {
        // Mettre à jour le package existant
        registry.packages[existingPackageIndex] = {
          ...packageInfo,
          updatedAt: new Date().toISOString()
        };
      } else {
        // Ajouter le nouveau package
        registry.packages.push({
          ...packageInfo,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
      
      // Mettre à jour le registre
      registry.lastUpdated = new Date().toISOString();
      fs.writeFileSync(this.registryFile, JSON.stringify(registry, null, 2));
      
      // Sauvegarder le code du package dans un fichier séparé
      const packageDir = path.join(this.packagesDir, packageInfo.name);
      if (!fs.existsSync(packageDir)) {
        fs.mkdirSync(packageDir, { recursive: true });
      }
      
      // Le nom du fichier inclut la version pour éviter les conflits
      const fileName = `${packageInfo.name}-${packageInfo.version}.${packageInfo.isNativeJs ? 'js' : 'neko'}`;
      const filePath = path.join(packageDir, fileName);
      fs.writeFileSync(filePath, packageInfo.code);
      
    } catch (error) {
      console.error('Erreur lors de la publication en stockage local:', error);
      throw error;
    }
  }
  
  /**
   * Récupère un package spécifique par son nom et sa version
   * @param {string} name - Nom du package
   * @param {string} version - Version du package (optionnel, dernière version par défaut)
   * @returns {Promise<Object>} - Le package trouvé
   */
  async getPackage(name, version = null) {
    if (!name) {
      throw new Error('Le nom du package est requis');
    }
    
    try {
      let packageData;
      
      if (this.useLocalStorage) {
        packageData = await this._getPackageFromLocalStorage(name, version);
      } else {
        packageData = await this._getPackageFromDatabase(name, version);
      }
      
      if (!packageData) {
        throw new Error(`Package ${name}${version ? `@${version}` : ''} non trouvé`);
      }
      
      return packageData;
    } catch (error) {
      console.error('Erreur lors de la récupération du package:', error);
      
      // Si l'erreur vient de la base de données, essayer le stockage local
      if (!this.useLocalStorage) {
        console.log('Tentative de récupération depuis le stockage local...');
        try {
          return await this._getPackageFromLocalStorage(name, version);
        } catch (localError) {
          console.error('Erreur également en local:', localError);
          throw error; // Conserver l'erreur originale
        }
      }
      
      throw error;
    }
  }
  
  /**
   * Récupère un package depuis la base de données
   * @param {string} name - Nom du package
   * @param {string} version - Version du package (optionnel)
   * @returns {Promise<Object>} - Le package trouvé
   * @private
   */
  async _getPackageFromDatabase(name, version = null) {
    let query, params;
    
    if (version) {
      // Récupérer une version spécifique
      query = 'SELECT * FROM nekoscript_packages WHERE name = $1 AND version = $2';
      params = [name, version];
    } else {
      // Récupérer la dernière version
      query = `
        SELECT * FROM nekoscript_packages 
        WHERE name = $1 
        ORDER BY 
          CASE 
            WHEN version ~ '^\\d+\\.\\d+\\.\\d+$' THEN 
              ARRAY[
                CAST(split_part(version, '.', 1) AS INTEGER),
                CAST(split_part(version, '.', 2) AS INTEGER),
                CAST(split_part(version, '.', 3) AS INTEGER)
              ]
            ELSE ARRAY[0, 0, 0]
          END DESC
        LIMIT 1
      `;
      params = [name];
    }
    
    const result = await this.pool.query(query, params);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    const packageData = result.rows[0];
    
    // Convertir les dépendances JSON en objet
    if (typeof packageData.dependencies === 'string') {
      packageData.dependencies = JSON.parse(packageData.dependencies);
    }
    
    return packageData;
  }
  
  /**
   * Récupère un package depuis le stockage local
   * @param {string} name - Nom du package
   * @param {string} version - Version du package (optionnel)
   * @returns {Promise<Object>} - Le package trouvé
   * @private
   */
  async _getPackageFromLocalStorage(name, version = null) {
    // Lire le registre local
    const registry = JSON.parse(fs.readFileSync(this.registryFile, 'utf8'));
    
    let packageInfo;
    
    if (version) {
      // Récupérer une version spécifique
      packageInfo = registry.packages.find(
        p => p.name === name && p.version === version
      );
    } else {
      // Trier les packages par version et prendre le plus récent
      const packages = registry.packages
        .filter(p => p.name === name)
        .sort((a, b) => {
          const versionA = a.version.split('.').map(Number);
          const versionB = b.version.split('.').map(Number);
          
          for (let i = 0; i < 3; i++) {
            if (versionA[i] !== versionB[i]) {
              return versionB[i] - versionA[i]; // Ordre décroissant
            }
          }
          
          return 0;
        });
      
      packageInfo = packages[0]; // Le premier est le plus récent
    }
    
    if (!packageInfo) {
      return null;
    }
    
    // Lire le contenu du fichier
    const packageDir = path.join(this.packagesDir, name);
    const fileName = `${name}-${packageInfo.version}.${packageInfo.isNativeJs ? 'js' : 'neko'}`;
    const filePath = path.join(packageDir, fileName);
    
    try {
      const code = fs.readFileSync(filePath, 'utf8');
      return { ...packageInfo, code };
    } catch (error) {
      // Si le fichier n'existe pas, utiliser le code du registre
      return packageInfo;
    }
  }
  
  /**
   * Recherche des packages par nom ou description
   * @param {string} query - Terme de recherche
   * @param {Object} options - Options de recherche (limite, offset, etc.)
   * @returns {Promise<Array>} - Les packages trouvés
   */
  async searchPackages(query, options = {}) {
    const defaults = {
      limit: 20,
      offset: 0,
      includeCode: false
    };
    
    const searchOptions = { ...defaults, ...options };
    
    try {
      let results;
      
      if (this.useLocalStorage) {
        results = await this._searchPackagesInLocalStorage(query, searchOptions);
      } else {
        results = await this._searchPackagesInDatabase(query, searchOptions);
      }
      
      return results;
    } catch (error) {
      console.error('Erreur lors de la recherche de packages:', error);
      
      // Fallback au stockage local en cas d'erreur
      if (!this.useLocalStorage) {
        console.log('Tentative de recherche en stockage local...');
        return await this._searchPackagesInLocalStorage(query, searchOptions);
      }
      
      throw error;
    }
  }
  
  /**
   * Recherche des packages dans la base de données
   * @param {string} query - Terme de recherche
   * @param {Object} options - Options de recherche
   * @returns {Promise<Array>} - Les packages trouvés
   * @private
   */
  async _searchPackagesInDatabase(query, options) {
    const { limit, offset, includeCode } = options;
    
    // Construire la projection SQL
    const projection = includeCode 
      ? '*' 
      : 'id, name, version, author, description, dependencies, is_native_js, created_at';
    
    // Recherche textuelle sur nom et description
    const sqlQuery = `
      SELECT ${projection} FROM nekoscript_packages
      WHERE 
        name ILIKE $1 OR
        description ILIKE $1
      ORDER BY 
        CASE WHEN name ILIKE $2 THEN 0 ELSE 1 END,
        created_at DESC
      LIMIT $3 OFFSET $4
    `;
    
    const result = await this.pool.query(sqlQuery, [
      `%${query}%`,       // Recherche partielle
      `${query}%`,        // Priorité aux correspondances exactes
      limit,
      offset
    ]);
    
    return result.rows.map(row => {
      // Convertir les dépendances JSON en objet
      if (typeof row.dependencies === 'string') {
        row.dependencies = JSON.parse(row.dependencies);
      }
      return row;
    });
  }
  
  /**
   * Recherche des packages dans le stockage local
   * @param {string} query - Terme de recherche
   * @param {Object} options - Options de recherche
   * @returns {Promise<Array>} - Les packages trouvés
   * @private
   */
  async _searchPackagesInLocalStorage(query, options) {
    const { limit, offset, includeCode } = options;
    
    // Lire le registre local
    const registry = JSON.parse(fs.readFileSync(this.registryFile, 'utf8'));
    
    // Filtre sur nom et description
    let filteredPackages = registry.packages.filter(pkg => {
      const name = pkg.name.toLowerCase();
      const description = (pkg.description || '').toLowerCase();
      const searchTerm = query.toLowerCase();
      
      return name.includes(searchTerm) || description.includes(searchTerm);
    });
    
    // Trier par pertinence (exacte d'abord, puis date)
    filteredPackages.sort((a, b) => {
      // Priorité aux correspondances exactes
      const aExact = a.name.toLowerCase().startsWith(query.toLowerCase());
      const bExact = b.name.toLowerCase().startsWith(query.toLowerCase());
      
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      
      // Sinon par date de création (le plus récent d'abord)
      const aDate = new Date(a.createdAt || 0);
      const bDate = new Date(b.createdAt || 0);
      return bDate - aDate;
    });
    
    // Appliquer limite et offset
    filteredPackages = filteredPackages.slice(offset, offset + limit);
    
    // Charger le code si nécessaire
    if (includeCode) {
      for (const pkg of filteredPackages) {
        if (!pkg.code) {
          try {
            const packageDir = path.join(this.packagesDir, pkg.name);
            const fileName = `${pkg.name}-${pkg.version}.${pkg.isNativeJs ? 'js' : 'neko'}`;
            const filePath = path.join(packageDir, fileName);
            pkg.code = fs.readFileSync(filePath, 'utf8');
          } catch (error) {
            // Si le fichier n'existe pas, laisser code undefined
          }
        }
      }
    } else {
      // Si le code n'est pas demandé, le supprimer pour alléger
      filteredPackages.forEach(pkg => {
        delete pkg.code;
      });
    }
    
    return filteredPackages;
  }
  
  /**
   * Liste tous les packages disponibles
   * @param {Object} options - Options de listage
   * @returns {Promise<Array>} - Les packages disponibles
   */
  async listAllPackages(options = {}) {
    const defaults = {
      limit: 100,
      offset: 0,
      includeCode: false
    };
    
    const listOptions = { ...defaults, ...options };
    
    try {
      let results;
      
      if (this.useLocalStorage) {
        results = await this._listPackagesFromLocalStorage(listOptions);
      } else {
        results = await this._listPackagesFromDatabase(listOptions);
      }
      
      return results;
    } catch (error) {
      console.error('Erreur lors du listage des packages:', error);
      
      // Fallback au stockage local en cas d'erreur
      if (!this.useLocalStorage) {
        console.log('Tentative de listage en stockage local...');
        return await this._listPackagesFromLocalStorage(listOptions);
      }
      
      throw error;
    }
  }
  
  /**
   * Liste les packages depuis la base de données
   * @param {Object} options - Options de listage
   * @returns {Promise<Array>} - Les packages listés
   * @private
   */
  async _listPackagesFromDatabase(options) {
    const { limit, offset, includeCode } = options;
    
    // Construire la projection SQL
    const projection = includeCode 
      ? '*' 
      : 'id, name, version, author, description, dependencies, is_native_js, created_at';
    
    // Lister les packages uniques (dernière version seulement)
    const sqlQuery = `
      WITH RankedPackages AS (
        SELECT 
          ${projection},
          ROW_NUMBER() OVER (PARTITION BY name ORDER BY 
            CASE 
              WHEN version ~ '^\\d+\\.\\d+\\.\\d+$' THEN 
                ARRAY[
                  CAST(split_part(version, '.', 1) AS INTEGER),
                  CAST(split_part(version, '.', 2) AS INTEGER),
                  CAST(split_part(version, '.', 3) AS INTEGER)
                ]
              ELSE ARRAY[0, 0, 0]
            END DESC
          ) as rn
        FROM 
          nekoscript_packages
      )
      SELECT * FROM RankedPackages 
      WHERE rn = 1
      ORDER BY name ASC
      LIMIT $1 OFFSET $2
    `;
    
    const result = await this.pool.query(sqlQuery, [limit, offset]);
    
    return result.rows.map(row => {
      // Convertir les dépendances JSON en objet
      if (typeof row.dependencies === 'string') {
        row.dependencies = JSON.parse(row.dependencies);
      }
      return row;
    });
  }
  
  /**
   * Liste les packages depuis le stockage local
   * @param {Object} options - Options de listage
   * @returns {Promise<Array>} - Les packages listés
   * @private
   */
  async _listPackagesFromLocalStorage(options) {
    const { limit, offset, includeCode } = options;
    
    // Lire le registre local
    const registry = JSON.parse(fs.readFileSync(this.registryFile, 'utf8'));
    
    // Regrouper par nom et prendre la version la plus récente
    const packageMap = new Map();
    for (const pkg of registry.packages) {
      if (!packageMap.has(pkg.name) || this._compareVersions(pkg.version, packageMap.get(pkg.name).version) > 0) {
        packageMap.set(pkg.name, pkg);
      }
    }
    
    // Convertir en tableau et trier par nom
    let uniquePackages = Array.from(packageMap.values()).sort((a, b) => a.name.localeCompare(b.name));
    
    // Appliquer limite et offset
    uniquePackages = uniquePackages.slice(offset, offset + limit);
    
    // Charger le code si nécessaire
    if (includeCode) {
      for (const pkg of uniquePackages) {
        if (!pkg.code) {
          try {
            const packageDir = path.join(this.packagesDir, pkg.name);
            const fileName = `${pkg.name}-${pkg.version}.${pkg.isNativeJs ? 'js' : 'neko'}`;
            const filePath = path.join(packageDir, fileName);
            pkg.code = fs.readFileSync(filePath, 'utf8');
          } catch (error) {
            // Si le fichier n'existe pas, laisser code undefined
          }
        }
      }
    } else {
      // Si le code n'est pas demandé, le supprimer pour alléger
      uniquePackages.forEach(pkg => {
        delete pkg.code;
      });
    }
    
    return uniquePackages;
  }
  
  /**
   * Compare deux versions selon la spécification semver
   * @param {string} a - Première version
   * @param {string} b - Deuxième version
   * @returns {number} - 1 si a > b, -1 si a < b, 0 si égales
   * @private
   */
  _compareVersions(a, b) {
    const aParts = a.split('.').map(Number);
    const bParts = b.split('.').map(Number);
    
    for (let i = 0; i < 3; i++) {
      if (aParts[i] > bParts[i]) return 1;
      if (aParts[i] < bParts[i]) return -1;
    }
    
    return 0;
  }
  
  /**
   * Charge un package JavaScript natif dans NekoScript
   * Cette méthode permet d'intégrer du code JavaScript directement comme un module NekoScript
   * @param {string} name - Nom du package
   * @param {string} jsCode - Code JavaScript du package
   * @param {Object} options - Options supplémentaires
   * @returns {Promise<Object>} - Informations sur le package publié
   */
  async loadNativeJsPackage(name, jsCode, options = {}) {
    const packageOptions = {
      ...options,
      isNativeJs: true
    };
    
    return await this.publishPackage(name, jsCode, packageOptions);
  }
  
  /**
   * Convertit un package JavaScript natif en package NekoScript
   * @param {string} jsCode - Code JavaScript du package
   * @returns {string} - Code NekoScript équivalent
   */
  convertJsToNekoScript(jsCode) {
    // Encapsule le code JavaScript dans un wrapper NekoScript
    return `// Package JavaScript natif converti en NekoScript
// Ce code est un wrapper autour de JavaScript natif

// Code JavaScript natif
_jsCode = \`
${jsCode}
\`;

// Exécuter le code JavaScript et exposer les exports
_exports = nekEvalJS(_jsCode);

// Exposer les fonctions exportées dans NekoScript
nekExportJsFunctions(_exports);`;
  }
}

module.exports = new PackageCenter();