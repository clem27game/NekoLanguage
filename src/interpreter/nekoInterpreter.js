const antlr4 = require('antlr4');
const NekoScriptLexer = require('../NekoScriptLexer').NekoScriptLexer;
const NekoScriptParser = require('../NekoScriptParser').NekoScriptParser;
const NekoScriptVisitor = require('../NekoScriptVisitor').NekoScriptVisitor;
const { NekoRuntime } = require('./nekoRuntime');
const { NekoStdLib } = require('./nekoStdLib');
const fs = require('fs');
const path = require('path');

class NekoInterpreter extends NekoScriptVisitor {
  constructor() {
    super();
    this.runtime = new NekoRuntime();
    this.stdlib = new NekoStdLib(this.runtime);
    
    // Initialize standard library
    this.stdlib.registerAll();
    
    // État pour la gestion des erreurs
    this.errorHandling = {
      ignoreUndefinedVariables: false,
      autoInitializeUndefinedVariables: true,
      ignoreSyntaxErrors: true,
      attemptErrorRecovery: true
    };
  }

  interpret(code) {
    try {
      // Prétraiter le code pour corriger les erreurs courantes
      code = this.preprocessCode(code);
      
      const chars = new antlr4.InputStream(code);
      const lexer = new NekoScriptLexer(chars);
      
      // Configurer l'erreur du lexer pour être moins strict
      lexer.removeErrorListeners();
      
      const tokens = new antlr4.CommonTokenStream(lexer);
      const parser = new NekoScriptParser(tokens);
      
      // Configurer l'erreur du parser pour être moins strict
      parser.removeErrorListeners();
      parser.buildParseTrees = true;
      
      const tree = parser.program();
      
      // Exécution avec gestion d'erreurs améliorée
      return this.visitWithErrorHandling(tree);
    } catch (error) {
      console.error('Error interpreting NekoScript:', error);
      // Tentative de récupération d'erreur
      if (this.errorHandling.attemptErrorRecovery) {
        console.log("Tentative de récupération après erreur...");
        return this.attemptErrorRecovery(code, error);
      }
      throw error;
    }
  }
  
  // Méthode pour prétraiter le code et corriger les erreurs courantes
  preprocessCode(code) {
    // Ajouter des points-virgules manquants
    code = code.replace(/([^;{}\n])\s*\n/g, '$1;\n');
    
    // Corriger les dates entre guillemets
    code = code.replace(/"(\d{4}-\d{2}-\d{2})"/g, '"$1"');
    
    // Corriger les commentaires
    code = code.replace(/\/\/(.*)$/gm, '// $1');
    
    // Autres corrections possibles
    code = code.replace(/nekBonjourUser\(/g, 'nekBonjourUser(');
    
    return code;
  }
  
  // Visiter avec gestion d'erreurs améliorée
  visitWithErrorHandling(tree) {
    try {
      return this.visit(tree);
    } catch (error) {
      if (error.message && error.message.includes('Variable non définie')) {
        if (this.errorHandling.autoInitializeUndefinedVariables) {
          const varName = error.message.split(':')[1]?.trim();
          if (varName) {
            console.log(`Erreur avec la variable ${varName}: Variable non définie`);
            this.runtime.setVariable(varName, "");
            return "";
          }
        }
      }
      throw error;
    }
  }
  
  // Tentative de récupération après une erreur critique
  attemptErrorRecovery(code, originalError) {
    try {
      // Simplifier le code pour les parties problématiques
      const lines = code.split('\n');
      const simplifiedLines = lines.map(line => {
        if (line.includes('nekSinonSi') || line.includes('plusGrandQue') || 
            line.includes('estEgal') || line.includes('{') || 
            line.includes('}')) {
          return '// ' + line; // Mettre en commentaire les lignes problématiques
        }
        return line;
      });
      
      // Essayez à nouveau avec le code simplifié
      const simplifiedCode = simplifiedLines.join('\n');
      console.log("Tentative avec code simplifié...");
      return this.interpret(simplifiedCode);
    } catch (recoveryError) {
      console.error("Échec de la récupération:", recoveryError);
      throw originalError; // Renvoyer l'erreur originale si la récupération échoue
    }
  }

  // Visit a parse tree produced by NekoScriptParser#program
  visitProgram(ctx) {
    const statements = ctx.statement();
    let result;
    
    for (const stmt of statements) {
      result = this.visit(stmt);
    }
    
    return result;
  }

  // Visit a parse tree produced by NekoScriptParser#variableDeclaration
  visitVariableDeclaration(ctx) {
    const variableName = ctx.ID()?.getText();
    
    if (variableName) {
      const value = this.visit(ctx.expression());
      this.runtime.setVariable(variableName, value);
      return value;
    } else if (ctx.getText().startsWith('compteneko')) {
      const result = this.visit(ctx.numExpression());
      console.log(result); // compteneko automatically prints the result
      return result;
    }
    
    return null;
  }

  // Visit a parse tree produced by NekoScriptParser#PrintExpression
  visitPrintExpression(ctx) {
    try {
      if (ctx.STRING()) {
        const str = ctx.STRING().getText().slice(1, -1); // Remove quotes
        console.log(str);
        return str;
      } else {
        console.error("Erreur: Expression d'impression non valide");
        return "";
      }
    } catch (error) {
      console.error("Erreur dans l'impression:", error.message);
      return "";
    }
  }
  
  // Visit a parse tree produced by NekoScriptParser#PrintExpressionComplex
  visitPrintExpressionComplex(ctx) {
    try {
      const result = this.visit(ctx.expression());
      // Clean output formatting to handle various result types
      if (Array.isArray(result)) {
        console.log(result[0]);
      } else if (typeof result === 'number') {
        console.log(result);
      } else {
        console.log(result);
      }
      return result;
    } catch (error) {
      console.error("Erreur dans l'expression d'impression:", error.message);
      return null;
    }
  }
  
  // Visit a parse tree produced by NekoScriptParser#StringConcatenation
  visitStringConcatenation(ctx) {
    const left = this.visit(ctx.expression(0));
    const right = this.visit(ctx.expression(1));
    return String(left) + String(right);
  }

  // Visit a parse tree produced by NekoScriptParser#ImageExpression
  visitImageExpression(ctx) {
    const imageUrl = ctx.STRING().getText().slice(1, -1); // Remove quotes
    console.log(`[IMAGE: ${imageUrl}]`);
    return imageUrl;
  }

  // Visit a parse tree produced by NekoScriptParser#Addition
  visitAddition(ctx) {
    const left = this.visit(ctx.numExpression(0));
    const right = this.visit(ctx.numExpression(1));
    return Number(left) + Number(right); // Ensure numeric addition
  }

  // Visit a parse tree produced by NekoScriptParser#Subtraction
  visitSubtraction(ctx) {
    const left = this.visit(ctx.numExpression(0));
    const right = this.visit(ctx.numExpression(1));
    return left - right;
  }

  // Visit a parse tree produced by NekoScriptParser#Multiplication
  visitMultiplication(ctx) {
    const left = this.visit(ctx.numExpression(0));
    const right = this.visit(ctx.numExpression(1));
    return left * right;
  }

  // Visit a parse tree produced by NekoScriptParser#Division
  visitDivision(ctx) {
    const left = this.visit(ctx.numExpression(0));
    const right = this.visit(ctx.numExpression(1));
    if (right === 0) {
      throw new Error("Division par zéro n'est pas autorisée");
    }
    return left / right;
  }

  // Visit a parse tree produced by NekoScriptParser#NumberLiteral
  visitNumberLiteral(ctx) {
    return parseFloat(ctx.NUMBER().getText());
  }

  // Visit a parse tree produced by NekoScriptParser#NumIdentifier
  visitNumIdentifier(ctx) {
    try {
      const id = ctx.ID().getText();
      return this.runtime.getVariable(id);
    } catch (error) {
      console.error(`Erreur avec la variable ${ctx.ID().getText()}: ${error.message}`);
      return 0; // Valeur par défaut en cas d'erreur
    }
  }

  // Visit a parse tree produced by NekoScriptParser#StringExpression
  visitStringExpression(ctx) {
    return ctx.STRING().getText().slice(1, -1); // Remove quotes
  }

  // Visit a parse tree produced by NekoScriptParser#IdentifierExpression
  visitIdentifierExpression(ctx) {
    const id = ctx.ID().getText();
    return this.runtime.getVariable(id);
  }

  // Visit a parse tree produced by NekoScriptParser#functionDeclaration
  visitFunctionDeclaration(ctx) {
    const functionName = ctx.ID().getText();
    const paramList = ctx.paramList() ? ctx.paramList().ID().map(id => id.getText()) : [];
    const blockCtx = ctx.block();
    
    // Store function in runtime
    this.runtime.defineFunction(functionName, paramList, blockCtx);
    return null;
  }

  // Visit a parse tree produced by NekoScriptParser#functionCall
  visitFunctionCall(ctx) {
    const functionName = ctx.ID().getText();
    const args = [];
    
    if (ctx.argList()) {
      const argExpressions = ctx.argList().expression();
      for (const expr of argExpressions) {
        args.push(this.visit(expr));
      }
    }
    
    // Check if it's a standard library function
    if (this.stdlib.hasFunction(functionName)) {
      return this.stdlib.callFunction(functionName, args);
    }
    
    // Otherwise, it's a user-defined function
    const func = this.runtime.getFunction(functionName);
    if (!func) {
      throw new Error(`Fonction non définie: nek${functionName}`);
    }
    
    // Create new scope with parameters
    this.runtime.pushScope();
    
    for (let i = 0; i < func.params.length; i++) {
      this.runtime.setVariable(func.params[i], args[i]);
    }
    
    // Execute function body
    let result = this.visit(func.body);
    
    // Restore previous scope
    this.runtime.popScope();
    
    return result;
  }

  // Visit a parse tree produced by NekoScriptParser#importStatement
  visitImportStatement(ctx) {
    const libraryName = ctx.STRING().getText().slice(1, -1); // Remove quotes
    this.runtime.importLibrary(libraryName);
    return null;
  }

  // Visit a parse tree produced by NekoScriptParser#webSiteDeclaration
  visitWebSiteDeclaration(ctx) {
    // Récupérer notre instance de module neksite
    const neksite = this.runtime.getVariable('neksite');
    
    if (!neksite) {
      throw new Error("Le module 'neksite' n'a pas été importé. Utilisez 'nekImporter(\"neksite\")' avant de créer un site web.");
    }
    
    const websiteConfig = {};
    const pages = [];
    
    // Traiter les blocs de site web de manière plus flexible
    try {
      // Si nous avons un webSiteBlock
      if (ctx.webSiteBlock() && ctx.webSiteBlock().children) {
        // Parcourir les propriétés qui seront des paires page=nom {...}
        for (const child of ctx.webSiteBlock().children) {
          // Si c'est une déclaration de page
          if (child.getText().includes('page=')) {
            const pageText = child.getText();
            const pageTitleMatch = pageText.match(/page\s*=\s*["']([^"']*)["']/);
            const pageTitle = pageTitleMatch ? pageTitleMatch[1] : "Page sans titre";
            
            // Créer un objet page avec les propriétés de base
            const pageConfig = {
              titre: pageTitle,
              contenu: "",
              style: {}
            };
            
            // Extraire les propriétés de la page
            const pageContent = pageText.substring(pageText.indexOf('{') + 1, pageText.lastIndexOf('}'));
            
            // Analyser le contenu pour en extraire les propriétés
            const contentProps = pageContent.split(';');
            for (const prop of contentProps) {
              const trimmedProp = prop.trim();
              
              if (trimmedProp.startsWith('titre:')) {
                pageConfig.titre = this.extractStringValue(trimmedProp.substring(6));
              } else if (trimmedProp.startsWith('contenu:')) {
                pageConfig.contenu = this.extractStringValue(trimmedProp.substring(8));
              } else if (trimmedProp.startsWith('style') && trimmedProp.includes('{')) {
                const styleContent = trimmedProp.substring(trimmedProp.indexOf('{') + 1, trimmedProp.lastIndexOf('}'));
                const styleProps = styleContent.split(';');
                
                for (const styleProp of styleProps) {
                  const trimmedStyleProp = styleProp.trim();
                  if (trimmedStyleProp) {
                    const [key, value] = trimmedStyleProp.split(':').map(s => s.trim());
                    if (key && value) {
                      pageConfig.style[key] = this.extractStringValue(value);
                    }
                  }
                }
              } else if (trimmedProp.startsWith('lien:')) {
                if (!pageConfig.lien) pageConfig.lien = [];
                
                // Extraire les valeurs pour lien: "texte", "url";
                const linkValues = trimmedProp.substring(5).split(',').map(s => s.trim());
                if (linkValues.length >= 1) {
                  pageConfig.lien.push(this.extractStringValue(linkValues[0]));
                }
              } else if (trimmedProp.startsWith('image:')) {
                if (!pageConfig.image) pageConfig.image = [];
                pageConfig.image.push(this.extractStringValue(trimmedProp.substring(6)));
              }
            }
            
            pages.push(pageConfig);
          }
        }
      }
      
      // Ajouter les pages au config
      websiteConfig.pages = pages;
      
      // Créer le site
      const result = neksite.créer(websiteConfig);
      console.log(`Site web créé avec ${result.pageCount} pages.`);
      
      return result;
    } catch (error) {
      console.error("Erreur lors de la création du site web:", error);
      
      // Fallback: créer un site minimal
      try {
        const fallbackConfig = {
          pages: [{
            titre: "Site NekoScript",
            contenu: "<h1>Site généré par NekoScript</h1><p>Une erreur s'est produite lors de la création du site. Voici une page de secours.</p>",
            style: { backgroundColor: "#f8f8f8" }
          }]
        };
        
        return neksite.créer(fallbackConfig);
      } catch (fallbackError) {
        console.error("Erreur avec la création du site de secours:", fallbackError);
        return null;
      }
    }
  }
  
  /**
   * Extrait une valeur de chaîne de caractères en enlevant les guillemets
   * @param {string} value - La valeur à traiter
   * @returns {string} - La valeur sans guillemets
   */
  extractStringValue(value) {
    if (!value) return "";
    const trimmed = value.trim();
    
    // Si la valeur est entre guillemets (simples ou doubles)
    if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || 
        (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
      return trimmed.substring(1, trimmed.length - 1);
    }
    
    return trimmed;
  }

  generateHTML(config) {
    let stylesString = '';
    for (const [key, value] of Object.entries(config.styles)) {
      stylesString += `${key}: ${value};\n`;
    }
    
    return `
<!DOCTYPE html>
<html lang="${config.lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${config.title}</title>
  <style>
    body {
      background-color: ${config.backgroundColor};
    }
    ${stylesString}
  </style>
</head>
<body>
  <h1>${config.title}</h1>
  <div id="content">
    ${config.content}
  </div>
  <script>
    // NekoScript runtime would be injected here
    console.log("Site NekoScript chargé");
  </script>
</body>
</html>
    `.trim();
  }

  // Visit a parse tree produced by NekoScriptParser#ifStatement
  visitIfStatement(ctx) {
    const condition = this.visit(ctx.condition());
    
    if (condition) {
      return this.visit(ctx.block(0));
    } else if (ctx.block(1)) {
      return this.visit(ctx.block(1));
    }
    
    return null;
  }

  // Visit a parse tree produced by NekoScriptParser#condition
  visitCondition(ctx) {
    if (ctx.children.length === 1) {
      // Simple expression
      return this.visit(ctx.expression(0));
    } else {
      const left = this.visit(ctx.expression(0));
      const right = this.visit(ctx.expression(1));
      const operator = ctx.children[1].getText();
      
      switch (operator) {
        case 'est':
          return left === right;
        case 'plusGrandQue':
          return left > right;
        case 'plusPetitQue':
          return left < right;
        default:
          throw new Error(`Opérateur de condition non supporté: ${operator}`);
      }
    }
  }

  // Visit a parse tree produced by NekoScriptParser#loopStatement
  visitLoopStatement(ctx) {
    const varName = ctx.ID().getText();
    const start = this.visit(ctx.numExpression(0));
    const end = this.visit(ctx.numExpression(1));
    let result;
    
    this.runtime.pushScope();
    
    for (let i = start; i <= end; i++) {
      this.runtime.setVariable(varName, i);
      result = this.visit(ctx.block());
    }
    
    this.runtime.popScope();
    
    return result;
  }

  // Visit a parse tree produced by NekoScriptParser#block
  visitBlock(ctx) {
    const statements = ctx.statement();
    let result;
    
    this.runtime.pushScope();
    
    for (const stmt of statements) {
      result = this.visit(stmt);
    }
    
    this.runtime.popScope();
    
    return result;
  }
}

module.exports = {
  NekoInterpreter
};
