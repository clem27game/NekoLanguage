const fs = require('fs');
const path = require('path');

class NekoRuntime {
  constructor() {
    // Stack of scopes for variables
    this.scopes = [{}];
    
    // Map of user-defined functions
    this.functions = {};
    
    // Loaded libraries
    this.libraries = new Set();
    
    // Home directory for NekoScript
    this.homeDir = process.env.HOME || process.env.USERPROFILE;
    this.nekoScriptDir = path.join(this.homeDir, '.nekoscript');
    this.librariesDir = path.join(this.nekoScriptDir, 'libraries');
  }

  // Variable management
  setVariable(name, value) {
    this.currentScope()[name] = value;
    return value;
  }

  getVariable(name) {
    // Search for variable in all scopes from current to global
    for (let i = this.scopes.length - 1; i >= 0; i--) {
      if (name in this.scopes[i]) {
        return this.scopes[i][name];
      }
    }
    
    throw new Error(`Variable non définie: ${name}`);
  }

  // Scope management
  currentScope() {
    return this.scopes[this.scopes.length - 1];
  }

  pushScope() {
    this.scopes.push({});
  }

  popScope() {
    if (this.scopes.length <= 1) {
      throw new Error("Impossible de supprimer le scope global");
    }
    return this.scopes.pop();
  }

  // Function management
  defineFunction(name, params, body) {
    this.functions[name] = { params, body };
  }

  getFunction(name) {
    return this.functions[name];
  }

  // Library management
  importLibrary(name) {
    if (this.libraries.has(name)) {
      return; // Already loaded
    }
    
    try {
      let library;

      // D'abord, on vérifie si c'est un module interne
      if (name === 'neksite') {
        // Import du module neksite depuis src/modules
        const { NekoSite } = require('../modules/neksite');
        library = { neksite: new NekoSite(this) };
        console.log(`Module interne importé: ${name}`);
      } else {
        // Ensuite, on cherche un fichier .neko standard
        const libraryPath = path.join(this.librariesDir, `${name}.neko`);
        
        if (fs.existsSync(libraryPath)) {
          // Bibliothèque .neko (à implémenter pour une vraie interprétation)
          console.log(`Bibliothèque .neko importée: ${name}`);
          library = {}; // Placeholder pour le contenu de la bibliothèque
        } else {
          // Enfin, on essaie d'importer un module Node.js
          try {
            const nodeModule = require(name);
            library = { ['nek' + name]: nodeModule };
            console.log(`Module Node.js importé: ${name}`);
          } catch (nodeError) {
            throw new Error(`Bibliothèque "${name}" introuvable (ni en interne, ni comme fichier .neko, ni comme module Node.js)`);
          }
        }
      }
      
      // Mark as loaded to prevent circular imports
      this.libraries.add(name);
      
      // Ajouter les fonctions et objets de la bibliothèque au scope global
      if (library) {
        for (const [key, value] of Object.entries(library)) {
          this.setVariable(key, value);
        }
      }
      
    } catch (error) {
      console.error(`Erreur lors de l'importation de la bibliothèque ${name}:`, error);
      throw error;
    }
  }
}

module.exports = {
  NekoRuntime
};
