const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { PackageRepository } = require('./packageRepository');

class PackageManager {
  constructor() {
    this.homeDir = process.env.HOME || process.env.USERPROFILE;
    this.nekoScriptDir = path.join(this.homeDir, '.nekoscript');
    this.librariesDir = path.join(this.nekoScriptDir, 'libraries');
    this.tempDir = path.join(this.nekoScriptDir, 'temp');
    this.repository = new PackageRepository();
    
    this.ensureDirectories();
  }

  ensureDirectories() {
    if (!fs.existsSync(this.nekoScriptDir)) {
      fs.mkdirSync(this.nekoScriptDir);
    }
    
    if (!fs.existsSync(this.librariesDir)) {
      fs.mkdirSync(this.librariesDir);
    }
    
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir);
    }
  }

  async downloadPackage(packageName) {
    try {
      console.log(`Téléchargement du package ${packageName}...`);
      
      // Check if package exists in repository
      const packageInfo = await this.repository.getPackageInfo(packageName);
      
      if (!packageInfo) {
        console.error(`Package ${packageName} non trouvé dans le dépôt.`);
        return false;
      }
      
      // Download package
      const packageData = await this.repository.downloadPackage(packageName);
      
      // Save package to local library
      const packagePath = path.join(this.librariesDir, `${packageName}.neko`);
      fs.writeFileSync(packagePath, packageData);
      
      console.log(`Package ${packageName} installé avec succès.`);
      return true;
    } catch (error) {
      console.error(`Erreur lors du téléchargement du package ${packageName}:`, error);
      return false;
    }
  }

  async publishPackage(packageName, packageData, language) {
    try {
      console.log(`Publication du package ${packageName}...`);
      
      // Validate package
      if (!this.validatePackage(packageData, language)) {
        console.error(`Le package ${packageName} n'est pas valide.`);
        return false;
      }
      
      // Upload package to repository
      await this.repository.publishPackage(packageName, packageData, language);
      
      console.log(`Package ${packageName} publié avec succès.`);
      return true;
    } catch (error) {
      console.error(`Erreur lors de la publication du package ${packageName}:`, error);
      return false;
    }
  }

  validatePackage(packageData, language) {
    // This is a simplified validation that would be expanded in a real implementation
    if (!packageData) {
      return false;
    }
    
    // Check package format based on language
    switch (language) {
      case 'nekoScript':
        return this.validateNekoScriptPackage(packageData);
      case 'javascript':
        return this.validateJavaScriptPackage(packageData);
      case 'python':
        return this.validatePythonPackage(packageData);
      case 'ruby':
        return this.validateRubyPackage(packageData);
      default:
        console.error(`Langage non supporté: ${language}`);
        return false;
    }
  }

  validateNekoScriptPackage(packageData) {
    // Check if it's valid NekoScript code
    // In a real implementation, we would parse the code to check for syntax errors
    return packageData.includes('nekImporter') || packageData.includes('nek');
  }

  validateJavaScriptPackage(packageData) {
    // Check if it's valid JavaScript code
    try {
      // Simple check to see if it's syntactically valid JS
      Function(`"use strict"; ${packageData}`);
      return true;
    } catch (error) {
      console.error("Erreur de validation JavaScript:", error);
      return false;
    }
  }

  validatePythonPackage(packageData) {
    // Check if it's valid Python code
    try {
      // Write to temporary file
      const tempFile = path.join(this.tempDir, 'temp_python.py');
      fs.writeFileSync(tempFile, packageData);
      
      // Check syntax with Python
      execSync(`python -m py_compile ${tempFile}`);
      
      // Clean up
      fs.unlinkSync(tempFile);
      
      return true;
    } catch (error) {
      console.error("Erreur de validation Python:", error);
      return false;
    }
  }

  validateRubyPackage(packageData) {
    // Check if it's valid Ruby code
    try {
      // Write to temporary file
      const tempFile = path.join(this.tempDir, 'temp_ruby.rb');
      fs.writeFileSync(tempFile, packageData);
      
      // Check syntax with Ruby
      execSync(`ruby -c ${tempFile}`);
      
      // Clean up
      fs.unlinkSync(tempFile);
      
      return true;
    } catch (error) {
      console.error("Erreur de validation Ruby:", error);
      return false;
    }
  }

  getInstalledPackages() {
    try {
      const files = fs.readdirSync(this.librariesDir);
      return files.filter(file => file.endsWith('.neko')).map(file => file.slice(0, -5));
    } catch (error) {
      console.error("Erreur lors de la récupération des packages installés:", error);
      return [];
    }
  }
}

module.exports = {
  PackageManager
};
