const antlr4 = require('antlr4');
const NekoScriptLexer = require('../NekoScriptLexer').NekoScriptLexer;
const NekoScriptParser = require('../NekoScriptParser').NekoScriptParser;
const NekoScriptVisitor = require('../NekoScriptVisitor').NekoScriptVisitor;
const { NekoRuntime } = require('./nekoRuntime');
const { NekoStdLib } = require('./nekoStdLib');

class NekoInterpreter extends NekoScriptVisitor {
  constructor() {
    super();
    this.runtime = new NekoRuntime();
    this.stdlib = new NekoStdLib(this.runtime);
    
    // Initialize standard library
    this.stdlib.registerAll();
  }

  interpret(code) {
    try {
      const chars = new antlr4.InputStream(code);
      const lexer = new NekoScriptLexer(chars);
      const tokens = new antlr4.CommonTokenStream(lexer);
      const parser = new NekoScriptParser(tokens);
      const tree = parser.program();
      
      return this.visit(tree);
    } catch (error) {
      console.error('Error interpreting NekoScript:', error);
      throw error;
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
    const str = ctx.STRING().getText().slice(1, -1); // Remove quotes
    console.log(str);
    return str;
  }
  
  // Visit a parse tree produced by NekoScriptParser#PrintExpressionComplex
  visitPrintExpressionComplex(ctx) {
    const result = this.visit(ctx.expression());
    console.log(result);
    return result;
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
    return left + right;
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
    const id = ctx.ID().getText();
    return this.runtime.getVariable(id);
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
    const websiteConfig = {
      title: '',
      content: '',
      lang: 'fr',
      backgroundColor: '#ffffff',
      styles: {},
      scripts: []
    };
    
    const properties = ctx.webSiteBlock().webSiteProperty();
    
    for (const prop of properties) {
      if (prop.getText().startsWith('contenu')) {
        websiteConfig.content = prop.STRING().getText().slice(1, -1);
      } else if (prop.getText().startsWith('titre')) {
        websiteConfig.title = prop.STRING().getText().slice(1, -1);
      } else if (prop.getText().startsWith('lang')) {
        websiteConfig.lang = prop.STRING().getText().slice(1, -1);
      } else if (prop.getText().startsWith('couleur-de-fond')) {
        websiteConfig.backgroundColor = prop.STRING().getText().slice(1, -1);
      } else if (prop.styleBlock()) {
        const styleProps = prop.styleBlock().styleProperty();
        for (const styleProp of styleProps) {
          const key = styleProp.ID().getText();
          const value = styleProp.STRING() 
            ? styleProp.STRING().getText().slice(1, -1)
            : styleProp.NUMBER().getText();
          websiteConfig.styles[key] = value;
        }
      } else if (prop.getText().startsWith('script')) {
        // Store the script block context to evaluate it later
        websiteConfig.scripts.push(prop.block());
      }
    }
    
    // Generate HTML
    const html = this.generateHTML(websiteConfig);
    
    // In a real implementation, this would create an HTML file or serve it
    console.log("Site web créé :");
    console.log(html);
    
    return websiteConfig;
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
