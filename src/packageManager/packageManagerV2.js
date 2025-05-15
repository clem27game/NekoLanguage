/**
 * Gestionnaire de Packages NekoScript v2
 * Interface unifiée pour la gestion des packages avec persistence permanente
 */

const packageCenter = require('./packageCenter');
const fs = require('fs');
const path = require('path');

class PackageManagerV2 {
  constructor() {
    this.packageCenter = packageCenter;
    
    // Initialiser les chemins
    this.homeDir = process.env.HOME || process.env.USERPROFILE || '.';
    this.nekoScriptDir = path.join(this.homeDir, '.nekoscript');
    this.packagesDir = path.join(this.nekoScriptDir, 'packages');
    this.librariesDir = path.join(this.nekoScriptDir, 'libraries');
    
    // Garantir que les répertoires existent
    this._ensureDirectories();
  }
  
  /**
   * S'assure que les répertoires nécessaires existent
   * @private
   */
  _ensureDirectories() {
    const dirs = [
      this.nekoScriptDir,
      this.packagesDir,
      this.librariesDir
    ];
    
    for (const dir of dirs) {
      if (!fs.existsSync(dir)) {
        try {
          fs.mkdirSync(dir, { recursive: true });
        } catch (error) {
          console.error(`Erreur lors de la création du répertoire ${dir}:`, error);
        }
      }
    }
  }
  
  /**
   * Publie un package dans le système de packages
   * @param {string} name - Nom du package
   * @param {string} content - Contenu du package
   * @param {Object} options - Options de publication
   * @returns {Promise<Object>} - Résultat de la publication
   */
  async publishPackage(name, content, options = {}) {
    try {
      // Étape 1: Publication dans le centre de packages (local ou global)
      const result = await this.packageCenter.publishPackage(name, content, options);
      
      // Étape 2: Copie dans le répertoire des bibliothèques pour importation facile
      this._savePackageToLibraries(name, content);
      
      console.log(`Package ${name} publié avec succès (version ${result.version}).`);
      return {
        success: true,
        packageName: name,
        version: result.version,
        updated: result.updated,
        storageMode: result.storageMode
      };
    } catch (error) {
      console.error(`Erreur lors de la publication du package ${name}:`, error);
      throw error;
    }
  }
  
  /**
   * Enregistre le package dans le répertoire des bibliothèques pour importation facile
   * @private
   */
  _savePackageToLibraries(name, content) {
    try {
      const libraryPath = path.join(this.librariesDir, `${name}.neko`);
      fs.writeFileSync(libraryPath, content);
    } catch (error) {
      console.warn(`Avertissement: Impossible de sauvegarder ${name} dans les bibliothèques:`, error.message);
    }
  }
  
  /**
   * Télécharge un package depuis le système de packages
   * @param {string} name - Nom du package
   * @param {string} version - Version spécifique (optionnel)
   * @returns {Promise<string>} - Contenu du package
   */
  async downloadPackage(name, version = null) {
    try {
      // Étape 1: Vérifier si le package est dans les bibliothèques locales
      const libraryPath = path.join(this.librariesDir, `${name}.neko`);
      
      if (fs.existsSync(libraryPath) && !version) {
        // Si pas de version spécifique et disponible localement, utiliser la version locale
        console.log(`Package ${name} chargé depuis les bibliothèques locales.`);
        return fs.readFileSync(libraryPath, 'utf8');
      }
      
      // Étape 2: Télécharger depuis le centre de packages
      const content = await this.packageCenter.downloadPackage(name, version);
      
      // Étape 3: Sauvegarder dans les bibliothèques si c'est la dernière version
      if (!version) {
        this._savePackageToLibraries(name, content);
      }
      
      return content;
    } catch (error) {
      console.error(`Erreur lors du téléchargement du package ${name}:`, error);
      
      // Dernière chance: vérifier les bibliothèques même si une version spécifique est demandée
      if (version) {
        try {
          const libraryPath = path.join(this.librariesDir, `${name}.neko`);
          if (fs.existsSync(libraryPath)) {
            console.log(`Version spécifique ${version} non trouvée, utilisation de la version locale disponible.`);
            return fs.readFileSync(libraryPath, 'utf8');
          }
        } catch (fallbackError) {
          // Ignorer les erreurs de cette dernière tentative
        }
      }
      
      throw error;
    }
  }
  
  /**
   * Liste tous les packages disponibles
   * @param {Object} options - Options de recherche
   * @returns {Promise<Array>} - Liste des packages
   */
  async listPackages(options = {}) {
    try {
      return await this.packageCenter.listPackages(options);
    } catch (error) {
      console.error("Erreur lors de la liste des packages:", error);
      throw error;
    }
  }
  
  /**
   * Recherche des packages par nom ou description
   * @param {string} query - Terme de recherche
   * @param {number} limit - Nombre maximum de résultats
   * @returns {Promise<Array>} - Liste des packages correspondants
   */
  async searchPackages(query, limit = 20) {
    try {
      return await this.packageCenter.listPackages({
        search: query,
        limit
      });
    } catch (error) {
      console.error(`Erreur lors de la recherche de packages (${query}):`, error);
      throw error;
    }
  }
  
  /**
   * Obtient les informations détaillées d'un package
   * @param {string} name - Nom du package
   * @returns {Promise<Object>} - Informations du package
   */
  async getPackageInfo(name) {
    try {
      return await this.packageCenter.getPackageInfo(name);
    } catch (error) {
      console.error(`Erreur lors de la récupération des informations du package ${name}:`, error);
      throw error;
    }
  }
}

module.exports = new PackageManagerV2();