/**
 * Schéma de base de données pour le gestionnaire de packages NekoScript
 * Utilise PostgreSQL pour stocker les packages de manière permanente
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

class PackageDatabase {
  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    
    this.initialized = false;
  }

  /**
   * Initialise la base de données
   */
  async initialize() {
    if (this.initialized) return;
    
    try {
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
      
      console.log('Base de données des packages initialisée avec succès.');
      this.initialized = true;
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de la base de données:', error);
      throw error;
    }
  }

  /**
   * Publie un package dans la base de données
   */
  async publishPackage(packageName, packageContent, language, options = {}) {
    await this.initialize();
    
    const { version = '1.0.0', author = 'Unknown', description = '' } = options;
    
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
        
        if (versionCheckResult.rows.length > 0 && version !== '0.0.0') {
          // La version existe déjà, incrémenter automatiquement le numéro de version
          // Extraire les composants de la version (majeur.mineur.correctif)
          const versionParts = version.split('.');
          if (versionParts.length !== 3) {
            throw new Error(`Format de version invalide: ${version}. Utilisez le format majeur.mineur.correctif (ex: 1.0.0)`);
          }
          
          // Incrémenter le dernier nombre (correctif)
          let [major, minor, patch] = versionParts.map(Number);
          patch++;
          const newVersion = `${major}.${minor}.${patch}`;
          console.log(`La version ${version} existe déjà. Incrémentation automatique à ${newVersion}`);
          version = newVersion;
        }
        
        // Insertion d'une nouvelle version
        await this.pool.query(
          'INSERT INTO package_versions (package_id, version, content) VALUES ($1, $2, $3) ON CONFLICT (package_id, version) DO UPDATE SET content = $3',
          [packageId, version, packageContent]
        );
        
        // Mise à jour des informations générales du package
        await this.pool.query(
          'UPDATE packages SET version = $1, description = $2, content = $3, language = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5',
          [version, description || '', packageContent, language, packageId]
        );
        
        return { packageName, version, updated: true };
      } else {
        // Validation du format de version
        if (version !== '0.0.0') {
          const versionParts = version.split('.');
          if (versionParts.length !== 3 || versionParts.some(part => isNaN(Number(part)))) {
            throw new Error(`Format de version invalide: ${version}. Utilisez le format majeur.mineur.correctif (ex: 1.0.0)`);
          }
        }
        
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
      console.error(`Erreur lors de la publication du package ${packageName}:`, error);
      throw error;
    }
  }

  /**
   * Récupère les informations d'un package
   */
  async getPackageInfo(packageName) {
    await this.initialize();
    
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
      console.error(`Erreur lors de la récupération des informations du package ${packageName}:`, error);
      throw error;
    }
  }

  /**
   * Télécharge un package
   */
  async downloadPackage(packageName, version = null) {
    await this.initialize();
    
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
        throw new Error(`Package ${packageName} non trouvé`);
      }
      
      // Incrémenter le compteur de téléchargements
      await this.pool.query(
        'UPDATE packages SET downloads = downloads + 1 WHERE name = $1',
        [packageName]
      );
      
      return result.rows[0].content;
    } catch (error) {
      console.error(`Erreur lors du téléchargement du package ${packageName}:`, error);
      throw error;
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