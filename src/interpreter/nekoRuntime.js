const fs = require('fs');
const path = require('path');
const NekoFunctionsManager = require('./nekoFunctionsManager');

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
    
    // Créer le répertoire NekoScript s'il n'existe pas
    if (!fs.existsSync(this.nekoScriptDir)) {
      try {
        fs.mkdirSync(this.nekoScriptDir, { recursive: true });
        console.log(`Répertoire créé: ${this.nekoScriptDir}`);
      } catch (error) {
        console.error("Erreur lors de la création du répertoire:", error);
      }
    }
    
    // Créer le répertoire de bibliothèques s'il n'existe pas
    if (!fs.existsSync(this.librariesDir)) {
      try {
        fs.mkdirSync(this.librariesDir, { recursive: true });
        console.log(`Répertoire créé: ${this.librariesDir}`);
      } catch (error) {
        console.error("Erreur lors de la création du répertoire:", error);
      }
    }
    
    // Initialiser le gestionnaire de fonctions
    this.functionsManager = new NekoFunctionsManager(this);
    
    // Initialiser les fonctions de base
    this._registerCoreFunctions();
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

  /**
   * Enregistre les fonctions de base du langage NekoScript
   * Cette méthode initialise toutes les fonctions intégrées
   * @private
   */
  _registerCoreFunctions() {
    // Fonctions d'affichage
    this.functionsManager.registerFunction('nekAfficher', function(value) {
      console.log(value);
      return value;
    }, {
      category: 'base',
      description: 'Affiche une valeur dans la console',
      parameters: [{ name: 'valeur', description: 'La valeur à afficher' }],
      returnType: 'any'
    });
    
    // Fonctions mathématiques
    this.functionsManager.registerFunction('nekArrondir', function(value) {
      return Math.round(value);
    }, {
      category: 'math',
      description: 'Arrondit un nombre à l\'entier le plus proche',
      parameters: [{ name: 'valeur', description: 'Le nombre à arrondir' }],
      returnType: 'number'
    });
    
    this.functionsManager.registerFunction('nekAleatoire', function(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }, {
      category: 'math',
      description: 'Génère un nombre aléatoire entre min et max (inclus)',
      parameters: [
        { name: 'min', description: 'La valeur minimale' },
        { name: 'max', description: 'La valeur maximale' }
      ],
      returnType: 'number'
    });
    
    // Fonctions de manipulation de chaînes
    this.functionsManager.registerFunction('nekLongueur', function(str) {
      return str.length;
    }, {
      category: 'chaines',
      description: 'Retourne la longueur d\'une chaîne',
      parameters: [{ name: 'chaine', description: 'La chaîne à mesurer' }],
      returnType: 'number'
    });
    
    // Fonctions système
    this.functionsManager.registerFunction('nekDate', function() {
      return new Date().toLocaleDateString();
    }, {
      category: 'sys',
      description: 'Retourne la date actuelle',
      parameters: [],
      returnType: 'string'
    });
    
    this.functionsManager.registerFunction('nekHeure', function() {
      return new Date().toLocaleTimeString();
    }, {
      category: 'sys',
      description: 'Retourne l\'heure actuelle',
      parameters: [],
      returnType: 'string'
    });
    
    // Fonctions d'exécution JS
    this.functionsManager.registerFunction('nekExecuterJS', function(code) {
      try {
        return eval(code);
      } catch (error) {
        console.error('Erreur lors de l\'exécution du code JS:', error);
        return null;
      }
    }, {
      category: 'sys',
      description: 'Exécute du code JavaScript et retourne le résultat',
      parameters: [{ name: 'code', description: 'Le code JavaScript à exécuter' }],
      returnType: 'any'
    });
    
    // Fonctions d'export 
    this.functionsManager.registerFunction('nekExporter', function(exportsObj) {
      return exportsObj;
    }, {
      category: 'base',
      description: 'Exporte des fonctions ou variables pour utilisation par d\'autres scripts',
      parameters: [{ name: 'exports', description: 'Objet contenant les exportations' }],
      returnType: 'object'
    });
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
      } else if (name === 'interne') {
        // Module interne avec toutes les fonctions de base
        library = this.functionsManager.getAllFunctionsByCategory();
        console.log(`Module interne de fonctions de base importé`);
      } else {
        try {
          // Essayer d'abord d'importer depuis le registre global des packages
          if (this.packageSystem) {
            const packageContent = this.packageSystem.downloadPackage(name);
            if (packageContent) {
              console.log(`Package ${name} importé depuis le registre global`);
              // TODO: Évaluer le contenu du package et exposer ses exports
              library = {}; 
            }
          }
        } catch (packageError) {
          console.log(`Erreur lors de l'importation du package ${name}:`, packageError.message);
        }
        
        if (!library) {
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
