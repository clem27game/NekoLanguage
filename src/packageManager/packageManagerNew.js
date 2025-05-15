/**
 * Gestionnaire de packages NekoScript amélioré
 * Permet de publier et télécharger des packages depuis une base de données PostgreSQL partagée
 */

const fs = require('fs');
const path = require('path');
const packageDatabase = require('./pkg-schema');

class PackageManager {
  constructor() {
    // Répertoire principal de NekoScript
    this.homeDir = process.env.HOME || process.env.USERPROFILE;
    this.nekoScriptDir = path.join(this.homeDir, '.nekoscript');
    this.librariesDir = path.join(this.nekoScriptDir, 'libraries');
    
    // Création des répertoires nécessaires s'ils n'existent pas
    this.ensureDirectories();
  }

  /**
   * Crée les répertoires nécessaires
   */
  ensureDirectories() {
    if (!fs.existsSync(this.nekoScriptDir)) {
      fs.mkdirSync(this.nekoScriptDir, { recursive: true });
      console.log(`Répertoire créé: ${this.nekoScriptDir}`);
    }
    
    if (!fs.existsSync(this.librariesDir)) {
      fs.mkdirSync(this.librariesDir, { recursive: true });
      console.log(`Répertoire créé: ${this.librariesDir}`);
    }
  }

  /**
   * Valide un package avant publication
   */
  validatePackage(packageData, language) {
    // TODO: Implémenter une validation plus poussée
    return packageData && packageData.length > 0;
  }

  /**
   * Publie un package
   */
  async publishPackage(packageName, packageData, language, options = {}) {
    try {
      console.log(`Publication du package ${packageName}...`);
      
      // Valider le package
      if (!this.validatePackage(packageData, language)) {
        console.error(`Le package ${packageName} n'est pas valide.`);
        return false;
      }
      
      // Publier le package dans la base de données
      await packageDatabase.publishPackage(packageName, packageData, language, options);
      
      // Sauvegarder aussi localement
      const packagePath = path.join(this.librariesDir, `${packageName}.neko`);
      fs.writeFileSync(packagePath, packageData);
      
      console.log(`Package ${packageName} publié avec succès !`);
      return true;
    } catch (error) {
      console.error(`Erreur lors de la publication du package ${packageName}:`, error);
      return false;
    }
  }

  /**
   * Télécharge un package depuis la base de données partagée
   */
  async downloadPackage(packageName, version = null) {
    try {
      console.log(`Téléchargement du package ${packageName}...`);
      
      // Vérifier si le package existe dans la base de données
      const packageInfo = await packageDatabase.getPackageInfo(packageName);
      
      if (!packageInfo) {
        console.error(`Package ${packageName} non trouvé dans le dépôt.`);
        return false;
      }
      
      // Télécharger le package
      const packageData = await packageDatabase.downloadPackage(packageName, version);
      
      // Sauvegarder le package dans la bibliothèque locale
      const packagePath = path.join(this.librariesDir, `${packageName}.neko`);
      fs.writeFileSync(packagePath, packageData);
      
      console.log(`Package ${packageName} installé avec succès !`);
      return true;
    } catch (error) {
      console.error(`Erreur lors du téléchargement du package ${packageName}:`, error);
      return false;
    }
  }

  /**
   * Recherche des packages dans le dépôt
   */
  async searchPackages(query, limit = 20) {
    try {
      console.log(`Recherche de packages: ${query || 'tous'}`);
      
      const packages = await packageDatabase.listPackages(limit, 0, query);
      
      return packages;
    } catch (error) {
      console.error(`Erreur lors de la recherche de packages:`, error);
      return [];
    }
  }

  /**
   * Récupère la liste des packages installés localement
   */
  async getInstalledPackages() {
    try {
      if (!fs.existsSync(this.librariesDir)) {
        return [];
      }
      
      const files = fs.readdirSync(this.librariesDir);
      const packageFiles = files.filter(file => file.endsWith('.neko'));
      const packageNames = packageFiles.map(file => path.basename(file, '.neko'));
      
      return packageNames;
    } catch (error) {
      console.error(`Erreur lors de la récupération des packages installés:`, error);
      return [];
    }
  }
}

module.exports = PackageManager;