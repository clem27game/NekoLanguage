#!/bin/bash

# Fix imports in NekoScriptLexer.js
sed -i 's/import antlr4 from/const antlr4 = require/g' src/NekoScriptLexer.js
sed -i 's/export default/module.exports = /g' src/NekoScriptLexer.js
sed -i 's/const atn = new antlr4.atn.ATNDeserializer/const atn = new antlr4.ATNDeserializer/g' src/NekoScriptLexer.js
sed -i 's/new antlr4.dfa.DFA/new antlr4.DFA/g' src/NekoScriptLexer.js
sed -i 's/new antlr4.atn.LexerATNSimulator/new antlr4.LexerATNSimulator/g' src/NekoScriptLexer.js
sed -i 's/new antlr4.atn.PredictionContextCache/new antlr4.PredictionContextCache/g' src/NekoScriptLexer.js
sed -i 's/module.exports =  class NekoScriptLexer/class NekoScriptLexer/g' src/NekoScriptLexer.js
echo -e "\nmodule.exports = { NekoScriptLexer };" >> src/NekoScriptLexer.js

# Fix imports in NekoScriptParser.js
sed -i 's/import antlr4 from/const antlr4 = require/g' src/NekoScriptParser.js
sed -i 's/import {NekoScriptListener} from/const {NekoScriptListener} = require/g' src/NekoScriptParser.js
sed -i 's/import NekoScriptListener from/const NekoScriptListener = require/g' src/NekoScriptParser.js
sed -i 's/import NekoScriptVisitor from/const NekoScriptVisitor = require/g' src/NekoScriptParser.js
sed -i 's/export default/module.exports = /g' src/NekoScriptParser.js
sed -i 's/const atn = new antlr4.atn.ATNDeserializer/const atn = new antlr4.ATNDeserializer/g' src/NekoScriptParser.js
sed -i 's/new antlr4.dfa.DFA/new antlr4.DFA/g' src/NekoScriptParser.js
sed -i 's/new antlr4.atn.ParserATNSimulator/new antlr4.ParserATNSimulator/g' src/NekoScriptParser.js
sed -i 's/new antlr4.atn.PredictionContextCache/new antlr4.PredictionContextCache/g' src/NekoScriptParser.js
sed -i 's/module.exports =  class NekoScriptParser/class NekoScriptParser/g' src/NekoScriptParser.js
echo -e "\nmodule.exports = { NekoScriptParser };" >> src/NekoScriptParser.js

# Fix imports in NekoScriptListener.js
sed -i 's/import antlr4 from/const antlr4 = require/g' src/NekoScriptListener.js
sed -i 's/export default class NekoScriptListener/class NekoScriptListener/g' src/NekoScriptListener.js
sed -i 's/extends antlr4.tree.ParseTreeListener/extends antlr4.ParseTreeListener/g' src/NekoScriptListener.js
echo -e "\nmodule.exports = { NekoScriptListener };" >> src/NekoScriptListener.js

# Fix imports in NekoScriptVisitor.js
sed -i 's/import antlr4 from/const antlr4 = require/g' src/NekoScriptVisitor.js
sed -i 's/export default class NekoScriptVisitor/class NekoScriptVisitor/g' src/NekoScriptVisitor.js
sed -i 's/extends antlr4.tree.ParseTreeVisitor/extends antlr4.ParseTreeVisitor/g' src/NekoScriptVisitor.js
echo -e "\nmodule.exports = { NekoScriptVisitor };" >> src/NekoScriptVisitor.js