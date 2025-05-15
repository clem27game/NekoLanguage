/**
 * Aide à l'interprétation des sites web NekoScript
 * Ce module facilite la création et le rendu des sites web
 * basés sur les variables définies par l'utilisateur.
 */

class NekoSiteHelper {
  constructor(runtime) {
    this.runtime = runtime;
  }

  /**
   * Traite une configuration de site web pour remplacer toutes les références
   * aux variables par leurs valeurs réelles avant la génération du HTML.
   *
   * @param {Object} config - Configuration du site web
   * @returns {Object} - Configuration avec références de variables remplacées
   */
  processConfig(config) {
    // Si la valeur n'est pas un objet, pas besoin de traitement
    if (!config || typeof config !== 'object') {
      return config;
    }
    
    // Si c'est un tableau, traiter chaque élément
    if (Array.isArray(config)) {
      return config.map(item => this.processConfig(item));
    }
    
    // Cloner l'objet pour éviter de modifier l'original
    const result = {};
    
    // Remplacer les variables dans chaque propriété
    for (const key in config) {
      const value = config[key];
      
      if (typeof value === 'string') {
        // C'est une chaîne, vérifier s'il y a des variables à remplacer
        result[key] = this.replaceVariables(value);
      } else if (typeof value === 'object' && value !== null) {
        // Traitement récursif pour les objets
        result[key] = this.processConfig(value);
      } else {
        // Les autres types sont conservés tels quels
        result[key] = value;
      }
    }
    
    return result;
  }
  
  /**
   * Remplace les références aux variables dans une chaîne
   * par leurs valeurs réelles.
   *
   * @param {string} text - Texte contenant des références de variables
   * @returns {string} - Texte avec variables remplacées
   */
  replaceVariables(text) {
    // Si ce n'est pas une chaîne, la retourner telle quelle
    if (typeof text !== 'string') {
      return text;
    }
    
    try {
      // Utiliser une expression régulière pour trouver les références de variables ${...}
      // mais uniquement celles qui sont des identifiants valides (évite le HTML)
      const variablePattern = /\${([a-zA-Z_][a-zA-Z0-9_]*)}/g;
      let processedText = text;
      let match;
      
      // Créer un tableau pour stocker tous les remplacements à faire
      const replacements = [];
      
      // Liste des mots clés HTML courants à ne pas considérer comme des erreurs
      const htmlKeywords = [
        'auteur', 'description', 'titre', 'contenu', 'style', 'class', 'cta',
        'header', 'footer', 'nav', 'section', 'article', 'div', 'span', 'p',
        'white', 'black', 'color', 'text', 'font', 'size', 'padding', 'margin',
        'dynamique', 'dynamiquement', 'puissante', 'content', 'feature'
      ];
      
      // Collecter tous les remplacements sans modifier la chaîne
      while ((match = variablePattern.exec(text)) !== null) {
        const fullMatch = match[0]; // ${variableName}
        const variableName = match[1]; // variableName
        const startIndex = match.index;
        const endIndex = startIndex + fullMatch.length;
        
        try {
          // Obtenir la valeur de la variable depuis le runtime avec le contexte web
          const value = this.runtime.getVariable(variableName, { webContext: true, silent: true });
          
          // Si la variable existe, prévoir son remplacement
          if (value !== undefined) {
            replacements.push({
              startIndex,
              endIndex,
              original: fullMatch,
              replacement: String(value),
              variableName
            });
          } else if (htmlKeywords.includes(variableName.toLowerCase())) {
            // Si c'est un mot-clé HTML, on laisse la variable telle quelle
            // sans générer d'avertissement
            continue;
          }
        } catch (error) {
          // En cas d'erreur, ignorer ce remplacement
        }
      }
      
      // Trier les remplacements par ordre décroissant d'index de début
      // pour ne pas perturber les indices lors des remplacements successifs
      replacements.sort((a, b) => b.startIndex - a.startIndex);
      
      // Effectuer tous les remplacements
      for (const replacement of replacements) {
        processedText = 
          processedText.substring(0, replacement.startIndex) +
          replacement.replacement +
          processedText.substring(replacement.endIndex);
      }
      
      return processedText;
    } catch (error) {
      console.error('Erreur lors du remplacement des variables:', error);
      // En cas d'erreur globale, retourner le texte original
      return text;
    }
  }
}

module.exports = { NekoSiteHelper };