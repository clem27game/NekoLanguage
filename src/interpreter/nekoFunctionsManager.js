/**
 * Gestionnaire de fonctions pour NekoScript
 * Ce module centralise la gestion des fonctions intégrées et des extensions
 */

class NekoFunctionsManager {
  constructor(runtime) {
    this.runtime = runtime;
    this.functions = {};
    this.categories = {};
    
    // Registre des packages qui ont étendu les fonctions
    this.packageExtensions = {};
    
    // Initialiser les catégories standards
    this.registerCategory('base', 'Fonctions de base du langage');
    this.registerCategory('math', 'Fonctions mathématiques');
    this.registerCategory('chaines', 'Manipulation de chaînes de caractères');
    this.registerCategory('tableaux', 'Manipulation de tableaux');
    this.registerCategory('sys', 'Fonctions système');
    this.registerCategory('fs', 'Opérations sur les fichiers');
    this.registerCategory('reseau', 'Fonctions réseau et HTTP');
  }
  
  /**
   * Enregistre une nouvelle catégorie de fonctions
   * @param {string} name - Nom de la catégorie
   * @param {string} description - Description de la catégorie
   */
  registerCategory(name, description) {
    this.categories[name] = {
      name,
      description,
      functions: []
    };
  }
  
  /**
   * Enregistre une fonction dans le gestionnaire
   * @param {string} name - Nom de la fonction
   * @param {Function} implementation - Implémentation de la fonction
   * @param {string} category - Catégorie de la fonction
   * @param {string} description - Description de la fonction
   * @param {Array} parameters - Description des paramètres
   * @param {string} returnType - Type de retour
   * @param {string} packageName - Nom du package qui ajoute cette fonction
   */
  registerFunction(name, implementation, options = {}) {
    const {
      category = 'base',
      description = '',
      parameters = [],
      returnType = 'any',
      packageName = 'core'
    } = options;
    
    // Enregistrer la fonction
    this.functions[name] = {
      name,
      implementation,
      category,
      description,
      parameters,
      returnType,
      packageName
    };
    
    // Ajouter la fonction à sa catégorie
    if (!this.categories[category]) {
      this.registerCategory(category, `Fonctions de la catégorie ${category}`);
    }
    
    this.categories[category].functions.push(name);
    
    // Ajouter la fonction au registre des extensions de package
    if (packageName !== 'core') {
      if (!this.packageExtensions[packageName]) {
        this.packageExtensions[packageName] = [];
      }
      this.packageExtensions[packageName].push(name);
    }
    
    // Exposer la fonction dans le runtime
    this.runtime[name] = (...args) => implementation.apply(this.runtime, args);
  }
  
  /**
   * Récupère les informations d'une fonction
   * @param {string} name - Nom de la fonction
   * @returns {Object} Informations sur la fonction
   */
  getFunctionInfo(name) {
    return this.functions[name];
  }
  
  /**
   * Récupère toutes les fonctions d'une catégorie
   * @param {string} category - Nom de la catégorie
   * @returns {Array} Liste des fonctions
   */
  getFunctionsInCategory(category) {
    if (!this.categories[category]) {
      return [];
    }
    
    return this.categories[category].functions.map(name => this.getFunctionInfo(name));
  }
  
  /**
   * Récupère toutes les fonctions regroupées par catégorie
   * @returns {Object} Fonctions par catégorie
   */
  getAllFunctionsByCategory() {
    const result = {};
    
    Object.keys(this.categories).forEach(category => {
      result[category] = this.getFunctionsInCategory(category);
    });
    
    return result;
  }
  
  /**
   * Récupère toutes les fonctions ajoutées par un package
   * @param {string} packageName - Nom du package
   * @returns {Array} Liste des fonctions
   */
  getFunctionsFromPackage(packageName) {
    if (!this.packageExtensions[packageName]) {
      return [];
    }
    
    return this.packageExtensions[packageName].map(name => this.getFunctionInfo(name));
  }
  
  /**
   * Ajoute des fonctions à partir d'un package
   * @param {string} packageName - Nom du package
   * @param {Object} functions - Fonctions à ajouter
   */
  addFunctionsFromPackage(packageName, functions) {
    Object.keys(functions).forEach(name => {
      // Pour les fonctions, on ajoute directement avec le nom original
      if (typeof functions[name] === 'function') {
        this.registerFunction(name, functions[name], { packageName });
      } 
      // Pour les objets contenant implementation et metadata
      else if (typeof functions[name] === 'object' && functions[name].implementation) {
        const { implementation, ...options } = functions[name];
        this.registerFunction(name, implementation, { 
          ...options, 
          packageName 
        });
      }
    });
  }
  
  /**
   * Génère la documentation de toutes les fonctions disponibles
   * @returns {string} Documentation HTML des fonctions
   */
  generateDocumentation() {
    let html = '<h1>Documentation des fonctions NekoScript</h1>';
    
    // Génération par catégorie
    Object.keys(this.categories).sort().forEach(categoryName => {
      const category = this.categories[categoryName];
      html += `<h2>${category.name}</h2>`;
      html += `<p>${category.description}</p>`;
      
      if (category.functions.length === 0) {
        html += '<p><em>Aucune fonction dans cette catégorie</em></p>';
        return;
      }
      
      html += '<table border="1" cellpadding="5">';
      html += '<tr><th>Fonction</th><th>Description</th><th>Paramètres</th><th>Retour</th><th>Package</th></tr>';
      
      category.functions.sort().forEach(funcName => {
        const func = this.getFunctionInfo(funcName);
        if (!func) return;
        
        html += '<tr>';
        html += `<td><code>${func.name}</code></td>`;
        html += `<td>${func.description || '-'}</td>`;
        
        // Paramètres
        html += '<td>';
        if (func.parameters && func.parameters.length > 0) {
          html += '<ul>';
          func.parameters.forEach(param => {
            if (typeof param === 'string') {
              html += `<li>${param}</li>`;
            } else {
              html += `<li><code>${param.name}</code>: ${param.description}</li>`;
            }
          });
          html += '</ul>';
        } else {
          html += '-';
        }
        html += '</td>';
        
        html += `<td>${func.returnType || 'any'}</td>`;
        html += `<td>${func.packageName}</td>`;
        html += '</tr>';
      });
      
      html += '</table>';
    });
    
    // Liste des packages qui ont ajouté des fonctions
    html += '<h2>Fonctions par package</h2>';
    
    const packages = Object.keys(this.packageExtensions);
    if (packages.length === 0) {
      html += '<p><em>Aucun package n\'a ajouté de fonctions</em></p>';
    } else {
      html += '<ul>';
      packages.sort().forEach(packageName => {
        const functions = this.packageExtensions[packageName];
        html += `<li><strong>${packageName}</strong>: ${functions.join(', ')}</li>`;
      });
      html += '</ul>';
    }
    
    return html;
  }
}

module.exports = NekoFunctionsManager;