/**
 * NekoScript Error Handler
 * Module de gestion avancée des erreurs pour NekoScript
 */

class NekoErrorHandler {
  constructor(runtime) {
    this.runtime = runtime;
    this.settings = {
      ignoreUndefinedVariables: false,
      autoInitializeUndefinedVariables: true,
      reportSyntaxErrors: true,
      attemptErrorRecovery: true
    };
  }

  /**
   * Prétraite le code pour corriger les erreurs courantes
   * @param {string} code - Le code source NekoScript à prétraiter
   * @returns {string} - Le code source prétraité
   */
  preprocessCode(code) {
    // Ajouter des points-virgules manquants à la fin des lignes
    code = code.replace(/([^;{}\s])\s*\n/g, '$1;\n');
    
    // Corriger les dates entre guillemets et autres corrections courantes
    code = code.replace(/"(\d{4}-\d{2}-\d{2})"/g, '"$1"');
    
    // Ajuster les espaces après les commentaires
    code = code.replace(/\/\/(.*)$/gm, '// $1');
    
    // Gérer les problèmes courants avec nekBonjourUser et les fonctions similaires
    code = code.replace(/([a-zA-Z]+)User\s*\(/g, '$1User(');
    
    return code;
  }

  /**
   * Gère une erreur de variable non définie
   * @param {Error} error - L'erreur capturée
   * @returns {boolean} - true si l'erreur a été gérée, false sinon
   */
  handleUndefinedVariable(error) {
    if (error.message && error.message.includes('Variable non définie')) {
      if (this.settings.autoInitializeUndefinedVariables) {
        // Extraire le nom de la variable
        const varName = error.message.split(':')[1]?.trim();
        if (varName) {
          console.log(`Erreur avec la variable ${varName}: Variable non définie`);
          this.runtime.setVariable(varName, "");
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Tente de récupérer après une erreur critique
   * @param {string} code - Le code source original
   * @param {Error} originalError - L'erreur originale
   * @param {Function} interpreterFunction - La fonction d'interprétation à utiliser
   * @returns {*} - Le résultat de l'interprétation récupérée
   */
  attemptRecovery(code, originalError, interpreterFunction) {
    if (!this.settings.attemptErrorRecovery) {
      throw originalError;
    }
    
    try {
      // Simplifier le code problématique
      const lines = code.split('\n');
      const simplifiedLines = lines.map(line => {
        if (line.includes('nekSinonSi') || line.includes('plusGrandQue') || 
            line.includes('estEgal') || line.includes('{') || 
            line.includes('}')) {
          return '// ' + line; // Mettre en commentaire les lignes problématiques
        }
        return line;
      });
      
      // Essayer à nouveau avec le code simplifié
      const simplifiedCode = simplifiedLines.join('\n');
      console.log("Tentative de récupération avec code simplifié...");
      return interpreterFunction(simplifiedCode);
    } catch (recoveryError) {
      console.error("Échec de la récupération:", recoveryError.message);
      // Essayer une approche encore plus simple
      try {
        const basicCode = code.split('\n')
          .filter(line => !line.includes('nekSi') && !line.includes('nekBoucle'))
          .map(line => line.startsWith('compteneko') || line.startsWith('neko') ? line : '// ' + line)
          .join('\n');
        
        console.log("Dernière tentative avec code minimal...");
        return interpreterFunction(basicCode);
      } catch (finalError) {
        throw originalError; // Si tout échoue, revenir à l'erreur originale
      }
    }
  }
}

module.exports = { NekoErrorHandler };