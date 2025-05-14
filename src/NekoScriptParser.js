// Generated from NekoScript.g4 by ANTLR 4.13.0
// jshint ignore: start
const antlr4 = require('antlr4');
const { NekoScriptListener } = require('./NekoScriptListener');
const { NekoScriptVisitor } = require('./NekoScriptVisitor');

// Ajout d'une définition manquante pour ATN
if (!antlr4.atn) {
  antlr4.atn = {};
}
if (!antlr4.atn.ATN) {
  antlr4.atn.ATN = {
    INVALID_ALT_NUMBER: -1
  };
}

const serializedATN = [4,1,37,250,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,
4,2,5,7,5,2,6,7,6,2,7,7,7,2,8,7,8,2,9,7,9,2,10,7,10,2,11,7,11,2,12,7,12,
2,13,7,13,2,14,7,14,2,15,7,15,2,16,7,16,2,17,7,17,2,18,7,18,2,19,7,19,1,
0,5,0,42,8,0,10,0,12,0,45,9,0,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,
1,57,8,1,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,3,2,69,8,2,1,3,1,3,1,3,
1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,
3,4,92,8,4,1,5,1,5,1,5,3,5,97,8,5,1,5,1,5,1,5,1,5,1,5,1,5,1,5,1,5,1,5,1,
5,1,5,1,5,5,5,111,8,5,10,5,12,5,114,9,5,1,6,1,6,1,6,1,6,3,6,120,8,6,1,6,
1,6,1,6,1,7,1,7,1,7,5,7,128,8,7,10,7,12,7,131,9,7,1,8,1,8,1,8,1,8,3,8,137,
8,8,1,8,1,8,1,9,1,9,1,9,5,9,144,8,9,10,9,12,9,147,9,9,1,10,1,10,1,10,1,10,
1,10,1,10,1,11,1,11,1,11,1,11,1,11,1,12,1,12,5,12,162,8,12,10,12,12,12,165,
9,12,1,12,1,12,1,13,1,13,1,13,1,13,1,13,1,13,1,13,1,13,1,13,1,13,1,13,1,
13,1,13,1,13,1,13,1,13,1,13,1,13,1,13,1,13,1,13,1,13,3,13,191,8,13,1,14,
1,14,5,14,195,8,14,10,14,12,14,198,9,14,1,14,1,14,1,15,1,15,1,15,1,15,1,
15,1,16,1,16,1,16,1,16,1,16,1,16,1,16,3,16,214,8,16,1,17,1,17,1,17,1,17,
1,17,1,17,1,17,1,17,1,17,1,17,1,17,1,17,1,17,3,17,229,8,17,1,18,1,18,1,18,
1,18,1,18,1,18,1,18,1,18,1,18,1,18,1,19,1,19,5,19,243,8,19,10,19,12,19,246,
9,19,1,19,1,19,1,19,0,1,10,20,0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,
32,34,36,38,0,1,1,0,34,35,265,0,43,1,0,0,0,2,56,1,0,0,0,4,68,1,0,0,0,6,70,
1,0,0,0,8,91,1,0,0,0,10,96,1,0,0,0,12,115,1,0,0,0,14,124,1,0,0,0,16,132,
1,0,0,0,18,140,1,0,0,0,20,148,1,0,0,0,22,154,1,0,0,0,24,159,1,0,0,0,26,190,
1,0,0,0,28,192,1,0,0,0,30,201,1,0,0,0,32,206,1,0,0,0,34,228,1,0,0,0,36,230,
1,0,0,0,38,240,1,0,0,0,40,42,3,2,1,0,41,40,1,0,0,0,42,45,1,0,0,0,43,41,1,
0,0,0,43,44,1,0,0,0,44,46,1,0,0,0,45,43,1,0,0,0,46,47,5,0,0,1,47,1,1,0,0,
0,48,57,3,4,2,0,49,57,3,6,3,0,50,57,3,12,6,0,51,57,3,20,10,0,52,57,3,22,
11,0,53,57,3,32,16,0,54,57,3,36,18,0,55,57,5,36,0,0,56,48,1,0,0,0,56,49,
1,0,0,0,56,50,1,0,0,0,56,51,1,0,0,0,56,52,1,0,0,0,56,53,1,0,0,0,56,54,1,
0,0,0,56,55,1,0,0,0,57,3,1,0,0,0,58,59,5,33,0,0,59,60,5,1,0,0,60,61,3,8,
4,0,61,62,5,2,0,0,62,69,1,0,0,0,63,64,5,3,0,0,64,65,5,1,0,0,65,66,3,10,5,
0,66,67,5,2,0,0,67,69,1,0,0,0,68,58,1,0,0,0,68,63,1,0,0,0,69,5,1,0,0,0,70,
71,3,8,4,0,71,72,5,2,0,0,72,7,1,0,0,0,73,74,5,4,0,0,74,75,5,1,0,0,75,76,
5,5,0,0,76,77,5,35,0,0,77,92,5,6,0,0,78,79,5,7,0,0,79,80,5,1,0,0,80,81,5,
5,0,0,81,82,5,35,0,0,82,92,5,6,0,0,83,92,3,16,8,0,84,92,3,10,5,0,85,92,5,
35,0,0,86,92,5,33,0,0,87,88,5,5,0,0,88,89,3,8,4,0,89,90,5,6,0,0,90,92,1,
0,0,0,91,73,1,0,0,0,91,78,1,0,0,0,91,83,1,0,0,0,91,84,1,0,0,0,91,85,1,0,
0,0,91,86,1,0,0,0,91,87,1,0,0,0,92,9,1,0,0,0,93,94,6,5,-1,0,94,97,5,34,0,
0,95,97,5,33,0,0,96,93,1,0,0,0,96,95,1,0,0,0,97,112,1,0,0,0,98,99,10,4,0,
0,99,100,5,8,0,0,100,111,3,10,5,5,101,102,10,3,0,0,102,103,5,9,0,0,103,111,
3,10,5,4,104,105,10,2,0,0,105,106,5,10,0,0,106,111,3,10,5,3,107,108,10,1,
0,0,108,109,5,11,0,0,109,111,3,10,5,2,110,98,1,0,0,0,110,101,1,0,0,0,110,
104,1,0,0,0,110,107,1,0,0,0,111,114,1,0,0,0,112,110,1,0,0,0,112,113,1,0,
0,0,113,11,1,0,0,0,114,112,1,0,0,0,115,116,5,12,0,0,116,117,5,33,0,0,117,
119,5,5,0,0,118,120,3,14,7,0,119,118,1,0,0,0,119,120,1,0,0,0,120,121,1,0,
0,0,121,122,5,6,0,0,122,123,3,38,19,0,123,13,1,0,0,0,124,129,5,33,0,0,125,
126,5,13,0,0,126,128,5,33,0,0,127,125,1,0,0,0,128,131,1,0,0,0,129,127,1,
0,0,0,129,130,1,0,0,0,130,15,1,0,0,0,131,129,1,0,0,0,132,133,5,12,0,0,133,
134,5,33,0,0,134,136,5,5,0,0,135,137,3,18,9,0,136,135,1,0,0,0,136,137,1,
0,0,0,137,138,1,0,0,0,138,139,5,6,0,0,139,17,1,0,0,0,140,145,3,8,4,0,141,
142,5,13,0,0,142,144,3,8,4,0,143,141,1,0,0,0,144,147,1,0,0,0,145,143,1,0,
0,0,145,146,1,0,0,0,146,19,1,0,0,0,147,145,1,0,0,0,148,149,5,14,0,0,149,
150,5,5,0,0,150,151,5,35,0,0,151,152,5,6,0,0,152,153,5,2,0,0,153,21,1,0,
0,0,154,155,5,15,0,0,155,156,5,13,0,0,156,157,5,16,0,0,157,158,3,24,12,0,
158,23,1,0,0,0,159,163,5,17,0,0,160,162,3,26,13,0,161,160,1,0,0,0,162,165,
1,0,0,0,163,161,1,0,0,0,163,164,1,0,0,0,164,166,1,0,0,0,165,163,1,0,0,0,
166,167,5,18,0,0,167,25,1,0,0,0,168,169,5,19,0,0,169,170,5,20,0,0,170,171,
5,5,0,0,171,172,5,35,0,0,172,173,5,6,0,0,173,191,5,13,0,0,174,175,5,21,0,
0,175,176,5,20,0,0,176,177,5,35,0,0,177,191,5,13,0,0,178,179,5,22,0,0,179,
180,5,20,0,0,180,181,5,35,0,0,181,191,5,13,0,0,182,183,5,23,0,0,183,184,
5,20,0,0,184,185,5,35,0,0,185,191,5,13,0,0,186,187,5,24,0,0,187,191,3,28,
14,0,188,189,5,16,0,0,189,191,3,38,19,0,190,168,1,0,0,0,190,174,1,0,0,0,
190,178,1,0,0,0,190,182,1,0,0,0,190,186,1,0,0,0,190,188,1,0,0,0,191,27,1,
0,0,0,192,196,5,17,0,0,193,195,3,30,15,0,194,193,1,0,0,0,195,198,1,0,0,0,
196,194,1,0,0,0,196,197,1,0,0,0,197,199,1,0,0,0,198,196,1,0,0,0,199,200,
5,18,0,0,200,29,1,0,0,0,201,202,5,33,0,0,202,203,5,20,0,0,203,204,7,0,0,
0,204,205,5,13,0,0,205,31,1,0,0,0,206,207,5,25,0,0,207,208,5,5,0,0,208,209,
3,34,17,0,209,210,5,6,0,0,210,213,3,38,19,0,211,212,5,26,0,0,212,214,3,38,
19,0,213,211,1,0,0,0,213,214,1,0,0,0,214,33,1,0,0,0,215,229,3,8,4,0,216,
217,3,8,4,0,217,218,5,27,0,0,218,219,3,8,4,0,219,229,1,0,0,0,220,221,3,8,
4,0,221,222,5,28,0,0,222,223,3,8,4,0,223,229,1,0,0,0,224,225,3,8,4,0,225,
226,5,29,0,0,226,227,3,8,4,0,227,229,1,0,0,0,228,215,1,0,0,0,228,216,1,0,
0,0,228,220,1,0,0,0,228,224,1,0,0,0,229,35,1,0,0,0,230,231,5,30,0,0,231,
232,5,5,0,0,232,233,5,33,0,0,233,234,5,31,0,0,234,235,3,10,5,0,235,236,5,
32,0,0,236,237,3,10,5,0,237,238,5,6,0,0,238,239,3,38,19,0,239,37,1,0,0,0,
240,244,5,17,0,0,241,243,3,2,1,0,242,241,1,0,0,0,243,246,1,0,0,0,244,242,
1,0,0,0,244,245,1,0,0,0,245,247,1,0,0,0,246,244,1,0,0,0,247,248,5,18,0,0,
248,39,1,0,0,0,17,43,56,68,91,96,110,112,119,129,136,145,163,190,196,213,
228,244];


const atn = new antlr4.ATNDeserializer().deserialize(serializedATN);

const decisionsToDFA = atn.decisionToState.map( (ds, index) => new antlr4.DFA(ds, index) );

const sharedContextCache = new antlr4.PredictionContextCache();

class NekoScriptParser extends antlr4.Parser {

    static grammarFileName = "NekoScript.g4";
    static literalNames = [ null, "'='", "';'", "'compteneko'", "'neko'", 
                            "'('", "')'", "'nekimg'", "'plus'", "'moins'", 
                            "'multiplier'", "'diviser'", "'nek'", "','", 
                            "'nekImporter'", "'neksite.cr\\u00E9er'", "'script'", 
                            "'{'", "'}'", "'contenu'", "':'", "'titre'", 
                            "'lang'", "'couleur-de-fond'", "'style'", "'nekSi'", 
                            "'nekSinon'", "'est'", "'plusGrandQue'", "'plusPetitQue'", 
                            "'nekBoucle'", "'de'", "'\\u00E0'" ];
    static symbolicNames = [ null, null, null, null, null, null, null, null, 
                             null, null, null, null, null, null, null, null, 
                             null, null, null, null, null, null, null, null, 
                             null, null, null, null, null, null, null, null, 
                             null, "ID", "NUMBER", "STRING", "COMMENT", 
                             "WS" ];
    static ruleNames = [ "program", "statement", "variableDeclaration", 
                         "expressionStatement", "expression", "numExpression", 
                         "functionDeclaration", "paramList", "functionCall", 
                         "argList", "importStatement", "webSiteDeclaration", 
                         "webSiteBlock", "webSiteProperty", "styleBlock", 
                         "styleProperty", "ifStatement", "condition", "loopStatement", 
                         "block" ];

    constructor(input) {
        super(input);
        this._interp = new antlr4.ParserATNSimulator(this, atn, decisionsToDFA, sharedContextCache);
        this.ruleNames = NekoScriptParser.ruleNames;
        this.literalNames = NekoScriptParser.literalNames;
        this.symbolicNames = NekoScriptParser.symbolicNames;
    }

    sempred(localctx, ruleIndex, predIndex) {
        switch(ruleIndex) {
        case 5:
                        return this.numExpression_sempred(localctx, predIndex);
        default:
            throw "No predicate with index:" + ruleIndex;
       }
    }

    numExpression_sempred(localctx, predIndex) {
        switch(predIndex) {
                case 0:
                        return this.precpred(this._ctx, 4);
                case 1:
                        return this.precpred(this._ctx, 3);
                case 2:
                        return this.precpred(this._ctx, 2);
                case 3:
                        return this.precpred(this._ctx, 1);
                default:
                        throw "No predicate with index:" + predIndex;
        }
    };




        program() {
            let localctx = new ProgramContext(this, this._ctx, this.state);
            this.enterRule(localctx, 0, NekoScriptParser.RULE_program);
            var _la = 0;
            try {
                this.enterOuterAlt(localctx, 1);
                this.state = 43;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                while((((_la) & ~0x1f) === 0 && ((1 << _la) & 1107349688) !== 0) || ((((_la - 33)) & ~0x1f) === 0 && ((1 << (_la - 33)) & 15) !== 0)) {
                    this.state = 40;
                    this.statement();
                    this.state = 45;
                    this._errHandler.sync(this);
                    _la = this._input.LA(1);
                }
                this.state = 46;
                this.match(NekoScriptParser.EOF);
            } catch (re) {
                if(re instanceof antlr4.RecognitionException) {
                        localctx.exception = re;
                        this._errHandler.reportError(this, re);
                        this._errHandler.recover(this, re);
                    } else {
                        throw re;
                    }
            } finally {
                this.exitRule();
            }
            return localctx;
        }



        statement() {
            let localctx = new StatementContext(this, this._ctx, this.state);
            this.enterRule(localctx, 2, NekoScriptParser.RULE_statement);
            try {
                this.state = 56;
                this._errHandler.sync(this);
                var la_ = this._interp.adaptivePredict(this._input,1,this._ctx);
                switch(la_) {
                case 1:
                    this.enterOuterAlt(localctx, 1);
                    this.state = 48;
                    this.variableDeclaration();
                    break;

                case 2:
                    this.enterOuterAlt(localctx, 2);
                    this.state = 49;
                    this.expressionStatement();
                    break;

                case 3:
                    this.enterOuterAlt(localctx, 3);
                    this.state = 50;
                    this.functionDeclaration();
                    break;

                case 4:
                    this.enterOuterAlt(localctx, 4);
                    this.state = 51;
                    this.importStatement();
                    break;

                case 5:
                    this.enterOuterAlt(localctx, 5);
                    this.state = 52;
                    this.webSiteDeclaration();
                    break;

                case 6:
                    this.enterOuterAlt(localctx, 6);
                    this.state = 53;
                    this.ifStatement();
                    break;

                case 7:
                    this.enterOuterAlt(localctx, 7);
                    this.state = 54;
                    this.loopStatement();
                    break;

                case 8:
                    this.enterOuterAlt(localctx, 8);
                    this.state = 55;
                    this.match(NekoScriptParser.COMMENT);
                    break;

                }
            } catch (re) {
                if(re instanceof antlr4.RecognitionException) {
                        localctx.exception = re;
                        this._errHandler.reportError(this, re);
                        this._errHandler.recover(this, re);
                    } else {
                        throw re;
                    }
            } finally {
                this.exitRule();
            }
            return localctx;
        }



        variableDeclaration() {
            let localctx = new VariableDeclarationContext(this, this._ctx, this.state);
            this.enterRule(localctx, 4, NekoScriptParser.RULE_variableDeclaration);
            try {
                this.state = 68;
                this._errHandler.sync(this);
                switch(this._input.LA(1)) {
                case 33:
                    this.enterOuterAlt(localctx, 1);
                    this.state = 58;
                    this.match(NekoScriptParser.ID);
                    this.state = 59;
                    this.match(NekoScriptParser.T__0);
                    this.state = 60;
                    this.expression();
                    this.state = 61;
                    this.match(NekoScriptParser.T__1);
                    break;
                case 3:
                    this.enterOuterAlt(localctx, 2);
                    this.state = 63;
                    this.match(NekoScriptParser.T__2);
                    this.state = 64;
                    this.match(NekoScriptParser.T__0);
                    this.state = 65;
                    this.numExpression(0);
                    this.state = 66;
                    this.match(NekoScriptParser.T__1);
                    break;
                default:
                    throw new antlr4.error.NoViableAltException(this);
                }
            } catch (re) {
                if(re instanceof antlr4.RecognitionException) {
                        localctx.exception = re;
                        this._errHandler.reportError(this, re);
                        this._errHandler.recover(this, re);
                    } else {
                        throw re;
                    }
            } finally {
                this.exitRule();
            }
            return localctx;
        }



        expressionStatement() {
            let localctx = new ExpressionStatementContext(this, this._ctx, this.state);
            this.enterRule(localctx, 6, NekoScriptParser.RULE_expressionStatement);
            try {
                this.enterOuterAlt(localctx, 1);
                this.state = 70;
                this.expression();
                this.state = 71;
                this.match(NekoScriptParser.T__1);
            } catch (re) {
                if(re instanceof antlr4.RecognitionException) {
                        localctx.exception = re;
                        this._errHandler.reportError(this, re);
                        this._errHandler.recover(this, re);
                    } else {
                        throw re;
                    }
            } finally {
                this.exitRule();
            }
            return localctx;
        }



        expression() {
            let localctx = new ExpressionContext(this, this._ctx, this.state);
            this.enterRule(localctx, 8, NekoScriptParser.RULE_expression);
            try {
                this.state = 91;
                this._errHandler.sync(this);
                var la_ = this._interp.adaptivePredict(this._input,3,this._ctx);
                switch(la_) {
                case 1:
                    localctx = new PrintExpressionContext(this, localctx);
                    this.enterOuterAlt(localctx, 1);
                    this.state = 73;
                    this.match(NekoScriptParser.T__3);
                    this.state = 74;
                    this.match(NekoScriptParser.T__0);
                    this.state = 75;
                    this.match(NekoScriptParser.T__4);
                    this.state = 76;
                    this.match(NekoScriptParser.STRING);
                    this.state = 77;
                    this.match(NekoScriptParser.T__5);
                    break;

                case 2:
                    localctx = new ImageExpressionContext(this, localctx);
                    this.enterOuterAlt(localctx, 2);
                    this.state = 78;
                    this.match(NekoScriptParser.T__6);
                    this.state = 79;
                    this.match(NekoScriptParser.T__0);
                    this.state = 80;
                    this.match(NekoScriptParser.T__4);
                    this.state = 81;
                    this.match(NekoScriptParser.STRING);
                    this.state = 82;
                    this.match(NekoScriptParser.T__5);
                    break;

                case 3:
                    localctx = new FunctionCallExpressionContext(this, localctx);
                    this.enterOuterAlt(localctx, 3);
                    this.state = 83;
                    this.functionCall();
                    break;

                case 4:
                    localctx = new NumberExpressionContext(this, localctx);
                    this.enterOuterAlt(localctx, 4);
                    this.state = 84;
                    this.numExpression(0);
                    break;

                case 5:
                    localctx = new StringExpressionContext(this, localctx);
                    this.enterOuterAlt(localctx, 5);
                    this.state = 85;
                    this.match(NekoScriptParser.STRING);
                    break;

                case 6:
                    localctx = new IdentifierExpressionContext(this, localctx);
                    this.enterOuterAlt(localctx, 6);
                    this.state = 86;
                    this.match(NekoScriptParser.ID);
                    break;

                case 7:
                    localctx = new ParenExpressionContext(this, localctx);
                    this.enterOuterAlt(localctx, 7);
                    this.state = 87;
                    this.match(NekoScriptParser.T__4);
                    this.state = 88;
                    this.expression();
                    this.state = 89;
                    this.match(NekoScriptParser.T__5);
                    break;

                }
            } catch (re) {
                if(re instanceof antlr4.RecognitionException) {
                        localctx.exception = re;
                        this._errHandler.reportError(this, re);
                        this._errHandler.recover(this, re);
                    } else {
                        throw re;
                    }
            } finally {
                this.exitRule();
            }
            return localctx;
        }


        numExpression(_p) {
                if(_p===undefined) {
                    _p = 0;
                }
            const _parentctx = this._ctx;
            const _parentState = this.state;
            let localctx = new NumExpressionContext(this, this._ctx, _parentState);
            let _prevctx = localctx;
            const _startState = 10;
            this.enterRecursionRule(localctx, 10, NekoScriptParser.RULE_numExpression, _p);
            try {
                this.enterOuterAlt(localctx, 1);
                this.state = 96;
                this._errHandler.sync(this);
                switch(this._input.LA(1)) {
                case 34:
                    localctx = new NumberLiteralContext(this, localctx);
                    this._ctx = localctx;
                    _prevctx = localctx;

                    this.state = 94;
                    this.match(NekoScriptParser.NUMBER);
                    break;
                case 33:
                    localctx = new NumIdentifierContext(this, localctx);
                    this._ctx = localctx;
                    _prevctx = localctx;
                    this.state = 95;
                    this.match(NekoScriptParser.ID);
                    break;
                default:
                    throw new antlr4.error.NoViableAltException(this);
                }
                this._ctx.stop = this._input.LT(-1);
                this.state = 112;
                this._errHandler.sync(this);
                var _alt = this._interp.adaptivePredict(this._input,6,this._ctx)
                while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
                    if(_alt===1) {
                        if(this._parseListeners!==null) {
                            this.triggerExitRuleEvent();
                        }
                        _prevctx = localctx;
                        this.state = 110;
                        this._errHandler.sync(this);
                        var la_ = this._interp.adaptivePredict(this._input,5,this._ctx);
                        switch(la_) {
                        case 1:
                            localctx = new AdditionContext(this, new NumExpressionContext(this, _parentctx, _parentState));
                            this.pushNewRecursionContext(localctx, _startState, NekoScriptParser.RULE_numExpression);
                            this.state = 98;
                            if (!( this.precpred(this._ctx, 4))) {
                                throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 4)");
                            }
                            this.state = 99;
                            this.match(NekoScriptParser.T__7);
                            this.state = 100;
                            this.numExpression(5);
                            break;

                        case 2:
                            localctx = new SubtractionContext(this, new NumExpressionContext(this, _parentctx, _parentState));
                            this.pushNewRecursionContext(localctx, _startState, NekoScriptParser.RULE_numExpression);
                            this.state = 101;
                            if (!( this.precpred(this._ctx, 3))) {
                                throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 3)");
                            }
                            this.state = 102;
                            this.match(NekoScriptParser.T__8);
                            this.state = 103;
                            this.numExpression(4);
                            break;

                        case 3:
                            localctx = new MultiplicationContext(this, new NumExpressionContext(this, _parentctx, _parentState));
                            this.pushNewRecursionContext(localctx, _startState, NekoScriptParser.RULE_numExpression);
                            this.state = 104;
                            if (!( this.precpred(this._ctx, 2))) {
                                throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 2)");
                            }
                            this.state = 105;
                            this.match(NekoScriptParser.T__9);
                            this.state = 106;
                            this.numExpression(3);
                            break;

                        case 4:
                            localctx = new DivisionContext(this, new NumExpressionContext(this, _parentctx, _parentState));
                            this.pushNewRecursionContext(localctx, _startState, NekoScriptParser.RULE_numExpression);
                            this.state = 107;
                            if (!( this.precpred(this._ctx, 1))) {
                                throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 1)");
                            }
                            this.state = 108;
                            this.match(NekoScriptParser.T__10);
                            this.state = 109;
                            this.numExpression(2);
                            break;

                        } 
                    }
                    this.state = 114;
                    this._errHandler.sync(this);
                    _alt = this._interp.adaptivePredict(this._input,6,this._ctx);
                }

            } catch( error) {
                if(error instanceof antlr4.RecognitionException) {
                        localctx.exception = error;
                        this._errHandler.reportError(this, error);
                        this._errHandler.recover(this, error);
                    } else {
                        throw error;
                    }
            } finally {
                this.unrollRecursionContexts(_parentctx)
            }
            return localctx;
        }



        functionDeclaration() {
            let localctx = new FunctionDeclarationContext(this, this._ctx, this.state);
            this.enterRule(localctx, 12, NekoScriptParser.RULE_functionDeclaration);
            var _la = 0;
            try {
                this.enterOuterAlt(localctx, 1);
                this.state = 115;
                this.match(NekoScriptParser.T__11);
                this.state = 116;
                this.match(NekoScriptParser.ID);
                this.state = 117;
                this.match(NekoScriptParser.T__4);
                this.state = 119;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                if(_la===33) {
                    this.state = 118;
                    this.paramList();
                }

                this.state = 121;
                this.match(NekoScriptParser.T__5);
                this.state = 122;
                this.block();
            } catch (re) {
                if(re instanceof antlr4.RecognitionException) {
                        localctx.exception = re;
                        this._errHandler.reportError(this, re);
                        this._errHandler.recover(this, re);
                    } else {
                        throw re;
                    }
            } finally {
                this.exitRule();
            }
            return localctx;
        }



        paramList() {
            let localctx = new ParamListContext(this, this._ctx, this.state);
            this.enterRule(localctx, 14, NekoScriptParser.RULE_paramList);
            var _la = 0;
            try {
                this.enterOuterAlt(localctx, 1);
                this.state = 124;
                this.match(NekoScriptParser.ID);
                this.state = 129;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                while(_la===13) {
                    this.state = 125;
                    this.match(NekoScriptParser.T__12);
                    this.state = 126;
                    this.match(NekoScriptParser.ID);
                    this.state = 131;
                    this._errHandler.sync(this);
                    _la = this._input.LA(1);
                }
            } catch (re) {
                if(re instanceof antlr4.RecognitionException) {
                        localctx.exception = re;
                        this._errHandler.reportError(this, re);
                        this._errHandler.recover(this, re);
                    } else {
                        throw re;
                    }
            } finally {
                this.exitRule();
            }
            return localctx;
        }



        functionCall() {
            let localctx = new FunctionCallContext(this, this._ctx, this.state);
            this.enterRule(localctx, 16, NekoScriptParser.RULE_functionCall);
            var _la = 0;
            try {
                this.enterOuterAlt(localctx, 1);
                this.state = 132;
                this.match(NekoScriptParser.T__11);
                this.state = 133;
                this.match(NekoScriptParser.ID);
                this.state = 134;
                this.match(NekoScriptParser.T__4);
                this.state = 136;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                if(((((_la - 4)) & ~0x1f) === 0 && ((1 << (_la - 4)) & 3758096651) !== 0)) {
                    this.state = 135;
                    this.argList();
                }

                this.state = 138;
                this.match(NekoScriptParser.T__5);
            } catch (re) {
                if(re instanceof antlr4.RecognitionException) {
                        localctx.exception = re;
                        this._errHandler.reportError(this, re);
                        this._errHandler.recover(this, re);
                    } else {
                        throw re;
                    }
            } finally {
                this.exitRule();
            }
            return localctx;
        }



        argList() {
            let localctx = new ArgListContext(this, this._ctx, this.state);
            this.enterRule(localctx, 18, NekoScriptParser.RULE_argList);
            var _la = 0;
            try {
                this.enterOuterAlt(localctx, 1);
                this.state = 140;
                this.expression();
                this.state = 145;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                while(_la===13) {
                    this.state = 141;
                    this.match(NekoScriptParser.T__12);
                    this.state = 142;
                    this.expression();
                    this.state = 147;
                    this._errHandler.sync(this);
                    _la = this._input.LA(1);
                }
            } catch (re) {
                if(re instanceof antlr4.RecognitionException) {
                        localctx.exception = re;
                        this._errHandler.reportError(this, re);
                        this._errHandler.recover(this, re);
                    } else {
                        throw re;
                    }
            } finally {
                this.exitRule();
            }
            return localctx;
        }



        importStatement() {
            let localctx = new ImportStatementContext(this, this._ctx, this.state);
            this.enterRule(localctx, 20, NekoScriptParser.RULE_importStatement);
            try {
                this.enterOuterAlt(localctx, 1);
                this.state = 148;
                this.match(NekoScriptParser.T__13);
                this.state = 149;
                this.match(NekoScriptParser.T__4);
                this.state = 150;
                this.match(NekoScriptParser.STRING);
                this.state = 151;
                this.match(NekoScriptParser.T__5);
                this.state = 152;
                this.match(NekoScriptParser.T__1);
            } catch (re) {
                if(re instanceof antlr4.RecognitionException) {
                        localctx.exception = re;
                        this._errHandler.reportError(this, re);
                        this._errHandler.recover(this, re);
                    } else {
                        throw re;
                    }
            } finally {
                this.exitRule();
            }
            return localctx;
        }



        webSiteDeclaration() {
            let localctx = new WebSiteDeclarationContext(this, this._ctx, this.state);
            this.enterRule(localctx, 22, NekoScriptParser.RULE_webSiteDeclaration);
            try {
                this.enterOuterAlt(localctx, 1);
                this.state = 154;
                this.match(NekoScriptParser.T__14);
                this.state = 155;
                this.match(NekoScriptParser.T__12);
                this.state = 156;
                this.match(NekoScriptParser.T__15);
                this.state = 157;
                this.webSiteBlock();
            } catch (re) {
                if(re instanceof antlr4.RecognitionException) {
                        localctx.exception = re;
                        this._errHandler.reportError(this, re);
                        this._errHandler.recover(this, re);
                    } else {
                        throw re;
                    }
            } finally {
                this.exitRule();
            }
            return localctx;
        }



        webSiteBlock() {
            let localctx = new WebSiteBlockContext(this, this._ctx, this.state);
            this.enterRule(localctx, 24, NekoScriptParser.RULE_webSiteBlock);
            var _la = 0;
            try {
                this.enterOuterAlt(localctx, 1);
                this.state = 159;
                this.match(NekoScriptParser.T__16);
                this.state = 163;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                while((((_la) & ~0x1f) === 0 && ((1 << _la) & 32047104) !== 0)) {
                    this.state = 160;
                    this.webSiteProperty();
                    this.state = 165;
                    this._errHandler.sync(this);
                    _la = this._input.LA(1);
                }
                this.state = 166;
                this.match(NekoScriptParser.T__17);
            } catch (re) {
                if(re instanceof antlr4.RecognitionException) {
                        localctx.exception = re;
                        this._errHandler.reportError(this, re);
                        this._errHandler.recover(this, re);
                    } else {
                        throw re;
                    }
            } finally {
                this.exitRule();
            }
            return localctx;
        }



        webSiteProperty() {
            let localctx = new WebSitePropertyContext(this, this._ctx, this.state);
            this.enterRule(localctx, 26, NekoScriptParser.RULE_webSiteProperty);
            try {
                this.state = 190;
                this._errHandler.sync(this);
                switch(this._input.LA(1)) {
                case 19:
                    this.enterOuterAlt(localctx, 1);
                    this.state = 168;
                    this.match(NekoScriptParser.T__18);
                    this.state = 169;
                    this.match(NekoScriptParser.T__19);
                    this.state = 170;
                    this.match(NekoScriptParser.T__4);
                    this.state = 171;
                    this.match(NekoScriptParser.STRING);
                    this.state = 172;
                    this.match(NekoScriptParser.T__5);
                    this.state = 173;
                    this.match(NekoScriptParser.T__12);
                    break;
                case 21:
                    this.enterOuterAlt(localctx, 2);
                    this.state = 174;
                    this.match(NekoScriptParser.T__20);
                    this.state = 175;
                    this.match(NekoScriptParser.T__19);
                    this.state = 176;
                    this.match(NekoScriptParser.STRING);
                    this.state = 177;
                    this.match(NekoScriptParser.T__12);
                    break;
                case 22:
                    this.enterOuterAlt(localctx, 3);
                    this.state = 178;
                    this.match(NekoScriptParser.T__21);
                    this.state = 179;
                    this.match(NekoScriptParser.T__19);
                    this.state = 180;
                    this.match(NekoScriptParser.STRING);
                    this.state = 181;
                    this.match(NekoScriptParser.T__12);
                    break;
                case 23:
                    this.enterOuterAlt(localctx, 4);
                    this.state = 182;
                    this.match(NekoScriptParser.T__22);
                    this.state = 183;
                    this.match(NekoScriptParser.T__19);
                    this.state = 184;
                    this.match(NekoScriptParser.STRING);
                    this.state = 185;
                    this.match(NekoScriptParser.T__12);
                    break;
                case 24:
                    this.enterOuterAlt(localctx, 5);
                    this.state = 186;
                    this.match(NekoScriptParser.T__23);
                    this.state = 187;
                    this.styleBlock();
                    break;
                case 16:
                    this.enterOuterAlt(localctx, 6);
                    this.state = 188;
                    this.match(NekoScriptParser.T__15);
                    this.state = 189;
                    this.block();
                    break;
                default:
                    throw new antlr4.error.NoViableAltException(this);
                }
            } catch (re) {
                if(re instanceof antlr4.RecognitionException) {
                        localctx.exception = re;
                        this._errHandler.reportError(this, re);
                        this._errHandler.recover(this, re);
                    } else {
                        throw re;
                    }
            } finally {
                this.exitRule();
            }
            return localctx;
        }



        styleBlock() {
            let localctx = new StyleBlockContext(this, this._ctx, this.state);
            this.enterRule(localctx, 28, NekoScriptParser.RULE_styleBlock);
            var _la = 0;
            try {
                this.enterOuterAlt(localctx, 1);
                this.state = 192;
                this.match(NekoScriptParser.T__16);
                this.state = 196;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                while(_la===33) {
                    this.state = 193;
                    this.styleProperty();
                    this.state = 198;
                    this._errHandler.sync(this);
                    _la = this._input.LA(1);
                }
                this.state = 199;
                this.match(NekoScriptParser.T__17);
            } catch (re) {
                if(re instanceof antlr4.RecognitionException) {
                        localctx.exception = re;
                        this._errHandler.reportError(this, re);
                        this._errHandler.recover(this, re);
                    } else {
                        throw re;
                    }
            } finally {
                this.exitRule();
            }
            return localctx;
        }



        styleProperty() {
            let localctx = new StylePropertyContext(this, this._ctx, this.state);
            this.enterRule(localctx, 30, NekoScriptParser.RULE_styleProperty);
            var _la = 0;
            try {
                this.enterOuterAlt(localctx, 1);
                this.state = 201;
                this.match(NekoScriptParser.ID);
                this.state = 202;
                this.match(NekoScriptParser.T__19);
                this.state = 203;
                _la = this._input.LA(1);
                if(!(_la===34 || _la===35)) {
                this._errHandler.recoverInline(this);
                }
                else {
                        this._errHandler.reportMatch(this);
                    this.consume();
                }
                this.state = 204;
                this.match(NekoScriptParser.T__12);
            } catch (re) {
                if(re instanceof antlr4.RecognitionException) {
                        localctx.exception = re;
                        this._errHandler.reportError(this, re);
                        this._errHandler.recover(this, re);
                    } else {
                        throw re;
                    }
            } finally {
                this.exitRule();
            }
            return localctx;
        }



        ifStatement() {
            let localctx = new IfStatementContext(this, this._ctx, this.state);
            this.enterRule(localctx, 32, NekoScriptParser.RULE_ifStatement);
            var _la = 0;
            try {
                this.enterOuterAlt(localctx, 1);
                this.state = 206;
                this.match(NekoScriptParser.T__24);
                this.state = 207;
                this.match(NekoScriptParser.T__4);
                this.state = 208;
                this.condition();
                this.state = 209;
                this.match(NekoScriptParser.T__5);
                this.state = 210;
                this.block();
                this.state = 213;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                if(_la===26) {
                    this.state = 211;
                    this.match(NekoScriptParser.T__25);
                    this.state = 212;
                    this.block();
                }

            } catch (re) {
                if(re instanceof antlr4.RecognitionException) {
                        localctx.exception = re;
                        this._errHandler.reportError(this, re);
                        this._errHandler.recover(this, re);
                    } else {
                        throw re;
                    }
            } finally {
                this.exitRule();
            }
            return localctx;
        }



        condition() {
            let localctx = new ConditionContext(this, this._ctx, this.state);
            this.enterRule(localctx, 34, NekoScriptParser.RULE_condition);
            try {
                this.state = 228;
                this._errHandler.sync(this);
                var la_ = this._interp.adaptivePredict(this._input,15,this._ctx);
                switch(la_) {
                case 1:
                    this.enterOuterAlt(localctx, 1);
                    this.state = 215;
                    this.expression();
                    break;

                case 2:
                    this.enterOuterAlt(localctx, 2);
                    this.state = 216;
                    this.expression();
                    this.state = 217;
                    this.match(NekoScriptParser.T__26);
                    this.state = 218;
                    this.expression();
                    break;

                case 3:
                    this.enterOuterAlt(localctx, 3);
                    this.state = 220;
                    this.expression();
                    this.state = 221;
                    this.match(NekoScriptParser.T__27);
                    this.state = 222;
                    this.expression();
                    break;

                case 4:
                    this.enterOuterAlt(localctx, 4);
                    this.state = 224;
                    this.expression();
                    this.state = 225;
                    this.match(NekoScriptParser.T__28);
                    this.state = 226;
                    this.expression();
                    break;

                }
            } catch (re) {
                if(re instanceof antlr4.RecognitionException) {
                        localctx.exception = re;
                        this._errHandler.reportError(this, re);
                        this._errHandler.recover(this, re);
                    } else {
                        throw re;
                    }
            } finally {
                this.exitRule();
            }
            return localctx;
        }



        loopStatement() {
            let localctx = new LoopStatementContext(this, this._ctx, this.state);
            this.enterRule(localctx, 36, NekoScriptParser.RULE_loopStatement);
            try {
                this.enterOuterAlt(localctx, 1);
                this.state = 230;
                this.match(NekoScriptParser.T__29);
                this.state = 231;
                this.match(NekoScriptParser.T__4);
                this.state = 232;
                this.match(NekoScriptParser.ID);
                this.state = 233;
                this.match(NekoScriptParser.T__30);
                this.state = 234;
                this.numExpression(0);
                this.state = 235;
                this.match(NekoScriptParser.T__31);
                this.state = 236;
                this.numExpression(0);
                this.state = 237;
                this.match(NekoScriptParser.T__5);
                this.state = 238;
                this.block();
            } catch (re) {
                if(re instanceof antlr4.RecognitionException) {
                        localctx.exception = re;
                        this._errHandler.reportError(this, re);
                        this._errHandler.recover(this, re);
                    } else {
                        throw re;
                    }
            } finally {
                this.exitRule();
            }
            return localctx;
        }



        block() {
            let localctx = new BlockContext(this, this._ctx, this.state);
            this.enterRule(localctx, 38, NekoScriptParser.RULE_block);
            var _la = 0;
            try {
                this.enterOuterAlt(localctx, 1);
                this.state = 240;
                this.match(NekoScriptParser.T__16);
                this.state = 244;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                while((((_la) & ~0x1f) === 0 && ((1 << _la) & 1107349688) !== 0) || ((((_la - 33)) & ~0x1f) === 0 && ((1 << (_la - 33)) & 15) !== 0)) {
                    this.state = 241;
                    this.statement();
                    this.state = 246;
                    this._errHandler.sync(this);
                    _la = this._input.LA(1);
                }
                this.state = 247;
                this.match(NekoScriptParser.T__17);
            } catch (re) {
                if(re instanceof antlr4.RecognitionException) {
                        localctx.exception = re;
                        this._errHandler.reportError(this, re);
                        this._errHandler.recover(this, re);
                    } else {
                        throw re;
                    }
            } finally {
                this.exitRule();
            }
            return localctx;
        }


}

NekoScriptParser.EOF = antlr4.Token.EOF;
NekoScriptParser.T__0 = 1;
NekoScriptParser.T__1 = 2;
NekoScriptParser.T__2 = 3;
NekoScriptParser.T__3 = 4;
NekoScriptParser.T__4 = 5;
NekoScriptParser.T__5 = 6;
NekoScriptParser.T__6 = 7;
NekoScriptParser.T__7 = 8;
NekoScriptParser.T__8 = 9;
NekoScriptParser.T__9 = 10;
NekoScriptParser.T__10 = 11;
NekoScriptParser.T__11 = 12;
NekoScriptParser.T__12 = 13;
NekoScriptParser.T__13 = 14;
NekoScriptParser.T__14 = 15;
NekoScriptParser.T__15 = 16;
NekoScriptParser.T__16 = 17;
NekoScriptParser.T__17 = 18;
NekoScriptParser.T__18 = 19;
NekoScriptParser.T__19 = 20;
NekoScriptParser.T__20 = 21;
NekoScriptParser.T__21 = 22;
NekoScriptParser.T__22 = 23;
NekoScriptParser.T__23 = 24;
NekoScriptParser.T__24 = 25;
NekoScriptParser.T__25 = 26;
NekoScriptParser.T__26 = 27;
NekoScriptParser.T__27 = 28;
NekoScriptParser.T__28 = 29;
NekoScriptParser.T__29 = 30;
NekoScriptParser.T__30 = 31;
NekoScriptParser.T__31 = 32;
NekoScriptParser.ID = 33;
NekoScriptParser.NUMBER = 34;
NekoScriptParser.STRING = 35;
NekoScriptParser.COMMENT = 36;
NekoScriptParser.WS = 37;

NekoScriptParser.RULE_program = 0;
NekoScriptParser.RULE_statement = 1;
NekoScriptParser.RULE_variableDeclaration = 2;
NekoScriptParser.RULE_expressionStatement = 3;
NekoScriptParser.RULE_expression = 4;
NekoScriptParser.RULE_numExpression = 5;
NekoScriptParser.RULE_functionDeclaration = 6;
NekoScriptParser.RULE_paramList = 7;
NekoScriptParser.RULE_functionCall = 8;
NekoScriptParser.RULE_argList = 9;
NekoScriptParser.RULE_importStatement = 10;
NekoScriptParser.RULE_webSiteDeclaration = 11;
NekoScriptParser.RULE_webSiteBlock = 12;
NekoScriptParser.RULE_webSiteProperty = 13;
NekoScriptParser.RULE_styleBlock = 14;
NekoScriptParser.RULE_styleProperty = 15;
NekoScriptParser.RULE_ifStatement = 16;
NekoScriptParser.RULE_condition = 17;
NekoScriptParser.RULE_loopStatement = 18;
NekoScriptParser.RULE_block = 19;

class ProgramContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = NekoScriptParser.RULE_program;
    }

        EOF() {
            return this.getToken(NekoScriptParser.EOF, 0);
        };

        statement = function(i) {
            if(i===undefined) {
                i = null;
            }
            if(i===null) {
                return this.getTypedRuleContexts(StatementContext);
            } else {
                return this.getTypedRuleContext(StatementContext,i);
            }
        };

        enterRule(listener) {
            if(listener instanceof NekoScriptListener ) {
                listener.enterProgram(this);
                }
        }

        exitRule(listener) {
            if(listener instanceof NekoScriptListener ) {
                listener.exitProgram(this);
                }
        }

        accept(visitor) {
            if ( visitor instanceof NekoScriptVisitor ) {
                return visitor.visitProgram(this);
            } else {
                return visitor.visitChildren(this);
            }
        }


}



class StatementContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = NekoScriptParser.RULE_statement;
    }

        variableDeclaration() {
            return this.getTypedRuleContext(VariableDeclarationContext,0);
        };

        expressionStatement() {
            return this.getTypedRuleContext(ExpressionStatementContext,0);
        };

        functionDeclaration() {
            return this.getTypedRuleContext(FunctionDeclarationContext,0);
        };

        importStatement() {
            return this.getTypedRuleContext(ImportStatementContext,0);
        };

        webSiteDeclaration() {
            return this.getTypedRuleContext(WebSiteDeclarationContext,0);
        };

        ifStatement() {
            return this.getTypedRuleContext(IfStatementContext,0);
        };

        loopStatement() {
            return this.getTypedRuleContext(LoopStatementContext,0);
        };

        COMMENT() {
            return this.getToken(NekoScriptParser.COMMENT, 0);
        };

        enterRule(listener) {
            if(listener instanceof NekoScriptListener ) {
                listener.enterStatement(this);
                }
        }

        exitRule(listener) {
            if(listener instanceof NekoScriptListener ) {
                listener.exitStatement(this);
                }
        }

        accept(visitor) {
            if ( visitor instanceof NekoScriptVisitor ) {
                return visitor.visitStatement(this);
            } else {
                return visitor.visitChildren(this);
            }
        }


}



class VariableDeclarationContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = NekoScriptParser.RULE_variableDeclaration;
    }

        ID() {
            return this.getToken(NekoScriptParser.ID, 0);
        };

        expression() {
            return this.getTypedRuleContext(ExpressionContext,0);
        };

        numExpression() {
            return this.getTypedRuleContext(NumExpressionContext,0);
        };

        enterRule(listener) {
            if(listener instanceof NekoScriptListener ) {
                listener.enterVariableDeclaration(this);
                }
        }

        exitRule(listener) {
            if(listener instanceof NekoScriptListener ) {
                listener.exitVariableDeclaration(this);
                }
        }

        accept(visitor) {
            if ( visitor instanceof NekoScriptVisitor ) {
                return visitor.visitVariableDeclaration(this);
            } else {
                return visitor.visitChildren(this);
            }
        }


}



class ExpressionStatementContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = NekoScriptParser.RULE_expressionStatement;
    }

        expression() {
            return this.getTypedRuleContext(ExpressionContext,0);
        };

        enterRule(listener) {
            if(listener instanceof NekoScriptListener ) {
                listener.enterExpressionStatement(this);
                }
        }

        exitRule(listener) {
            if(listener instanceof NekoScriptListener ) {
                listener.exitExpressionStatement(this);
                }
        }

        accept(visitor) {
            if ( visitor instanceof NekoScriptVisitor ) {
                return visitor.visitExpressionStatement(this);
            } else {
                return visitor.visitChildren(this);
            }
        }


}



class ExpressionContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = NekoScriptParser.RULE_expression;
    }


         
                copyFrom(ctx) {
                        super.copyFrom(ctx);
                }

}


class PrintExpressionContext extends ExpressionContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

        STRING() {
            return this.getToken(NekoScriptParser.STRING, 0);
        };

        enterRule(listener) {
            if(listener instanceof NekoScriptListener ) {
                listener.enterPrintExpression(this);
                }
        }

        exitRule(listener) {
            if(listener instanceof NekoScriptListener ) {
                listener.exitPrintExpression(this);
                }
        }

        accept(visitor) {
            if ( visitor instanceof NekoScriptVisitor ) {
                return visitor.visitPrintExpression(this);
            } else {
                return visitor.visitChildren(this);
            }
        }


}

NekoScriptParser.PrintExpressionContext = PrintExpressionContext;

class ImageExpressionContext extends ExpressionContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

        STRING() {
            return this.getToken(NekoScriptParser.STRING, 0);
        };

        enterRule(listener) {
            if(listener instanceof NekoScriptListener ) {
                listener.enterImageExpression(this);
                }
        }

        exitRule(listener) {
            if(listener instanceof NekoScriptListener ) {
                listener.exitImageExpression(this);
                }
        }

        accept(visitor) {
            if ( visitor instanceof NekoScriptVisitor ) {
                return visitor.visitImageExpression(this);
            } else {
                return visitor.visitChildren(this);
            }
        }


}

NekoScriptParser.ImageExpressionContext = ImageExpressionContext;

class StringExpressionContext extends ExpressionContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

        STRING() {
            return this.getToken(NekoScriptParser.STRING, 0);
        };

        enterRule(listener) {
            if(listener instanceof NekoScriptListener ) {
                listener.enterStringExpression(this);
                }
        }

        exitRule(listener) {
            if(listener instanceof NekoScriptListener ) {
                listener.exitStringExpression(this);
                }
        }

        accept(visitor) {
            if ( visitor instanceof NekoScriptVisitor ) {
                return visitor.visitStringExpression(this);
            } else {
                return visitor.visitChildren(this);
            }
        }


}

NekoScriptParser.StringExpressionContext = StringExpressionContext;

class ParenExpressionContext extends ExpressionContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

        expression() {
            return this.getTypedRuleContext(ExpressionContext,0);
        };

        enterRule(listener) {
            if(listener instanceof NekoScriptListener ) {
                listener.enterParenExpression(this);
                }
        }

        exitRule(listener) {
            if(listener instanceof NekoScriptListener ) {
                listener.exitParenExpression(this);
                }
        }

        accept(visitor) {
            if ( visitor instanceof NekoScriptVisitor ) {
                return visitor.visitParenExpression(this);
            } else {
                return visitor.visitChildren(this);
            }
        }


}

NekoScriptParser.ParenExpressionContext = ParenExpressionContext;

class NumberExpressionContext extends ExpressionContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

        numExpression() {
            return this.getTypedRuleContext(NumExpressionContext,0);
        };

        enterRule(listener) {
            if(listener instanceof NekoScriptListener ) {
                listener.enterNumberExpression(this);
                }
        }

        exitRule(listener) {
            if(listener instanceof NekoScriptListener ) {
                listener.exitNumberExpression(this);
                }
        }

        accept(visitor) {
            if ( visitor instanceof NekoScriptVisitor ) {
                return visitor.visitNumberExpression(this);
            } else {
                return visitor.visitChildren(this);
            }
        }


}

NekoScriptParser.NumberExpressionContext = NumberExpressionContext;

class FunctionCallExpressionContext extends ExpressionContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

        functionCall() {
            return this.getTypedRuleContext(FunctionCallContext,0);
        };

        enterRule(listener) {
            if(listener instanceof NekoScriptListener ) {
                listener.enterFunctionCallExpression(this);
                }
        }

        exitRule(listener) {
            if(listener instanceof NekoScriptListener ) {
                listener.exitFunctionCallExpression(this);
                }
        }

        accept(visitor) {
            if ( visitor instanceof NekoScriptVisitor ) {
                return visitor.visitFunctionCallExpression(this);
            } else {
                return visitor.visitChildren(this);
            }
        }


}

NekoScriptParser.FunctionCallExpressionContext = FunctionCallExpressionContext;

class IdentifierExpressionContext extends ExpressionContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

        ID() {
            return this.getToken(NekoScriptParser.ID, 0);
        };

        enterRule(listener) {
            if(listener instanceof NekoScriptListener ) {
                listener.enterIdentifierExpression(this);
                }
        }

        exitRule(listener) {
            if(listener instanceof NekoScriptListener ) {
                listener.exitIdentifierExpression(this);
                }
        }

        accept(visitor) {
            if ( visitor instanceof NekoScriptVisitor ) {
                return visitor.visitIdentifierExpression(this);
            } else {
                return visitor.visitChildren(this);
            }
        }


}

NekoScriptParser.IdentifierExpressionContext = IdentifierExpressionContext;

class NumExpressionContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = NekoScriptParser.RULE_numExpression;
    }


         
                copyFrom(ctx) {
                        super.copyFrom(ctx);
                }

}


class AdditionContext extends NumExpressionContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

        numExpression = function(i) {
            if(i===undefined) {
                i = null;
            }
            if(i===null) {
                return this.getTypedRuleContexts(NumExpressionContext);
            } else {
                return this.getTypedRuleContext(NumExpressionContext,i);
            }
        };

        enterRule(listener) {
            if(listener instanceof NekoScriptListener ) {
                listener.enterAddition(this);
                }
        }

        exitRule(listener) {
            if(listener instanceof NekoScriptListener ) {
                listener.exitAddition(this);
                }
        }

        accept(visitor) {
            if ( visitor instanceof NekoScriptVisitor ) {
                return visitor.visitAddition(this);
            } else {
                return visitor.visitChildren(this);
            }
        }


}

NekoScriptParser.AdditionContext = AdditionContext;

class MultiplicationContext extends NumExpressionContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

        numExpression = function(i) {
            if(i===undefined) {
                i = null;
            }
            if(i===null) {
                return this.getTypedRuleContexts(NumExpressionContext);
            } else {
                return this.getTypedRuleContext(NumExpressionContext,i);
            }
        };

        enterRule(listener) {
            if(listener instanceof NekoScriptListener ) {
                listener.enterMultiplication(this);
                }
        }

        exitRule(listener) {
            if(listener instanceof NekoScriptListener ) {
                listener.exitMultiplication(this);
                }
        }

        accept(visitor) {
            if ( visitor instanceof NekoScriptVisitor ) {
                return visitor.visitMultiplication(this);
            } else {
                return visitor.visitChildren(this);
            }
        }


}

NekoScriptParser.MultiplicationContext = MultiplicationContext;

class SubtractionContext extends NumExpressionContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

        numExpression = function(i) {
            if(i===undefined) {
                i = null;
            }
            if(i===null) {
                return this.getTypedRuleContexts(NumExpressionContext);
            } else {
                return this.getTypedRuleContext(NumExpressionContext,i);
            }
        };

        enterRule(listener) {
            if(listener instanceof NekoScriptListener ) {
                listener.enterSubtraction(this);
                }
        }

        exitRule(listener) {
            if(listener instanceof NekoScriptListener ) {
                listener.exitSubtraction(this);
                }
        }

        accept(visitor) {
            if ( visitor instanceof NekoScriptVisitor ) {
                return visitor.visitSubtraction(this);
            } else {
                return visitor.visitChildren(this);
            }
        }


}

NekoScriptParser.SubtractionContext = SubtractionContext;

class NumIdentifierContext extends NumExpressionContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

        ID() {
            return this.getToken(NekoScriptParser.ID, 0);
        };

        enterRule(listener) {
            if(listener instanceof NekoScriptListener ) {
                listener.enterNumIdentifier(this);
                }
        }

        exitRule(listener) {
            if(listener instanceof NekoScriptListener ) {
                listener.exitNumIdentifier(this);
                }
        }

        accept(visitor) {
            if ( visitor instanceof NekoScriptVisitor ) {
                return visitor.visitNumIdentifier(this);
            } else {
                return visitor.visitChildren(this);
            }
        }


}

NekoScriptParser.NumIdentifierContext = NumIdentifierContext;

class DivisionContext extends NumExpressionContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

        numExpression = function(i) {
            if(i===undefined) {
                i = null;
            }
            if(i===null) {
                return this.getTypedRuleContexts(NumExpressionContext);
            } else {
                return this.getTypedRuleContext(NumExpressionContext,i);
            }
        };

        enterRule(listener) {
            if(listener instanceof NekoScriptListener ) {
                listener.enterDivision(this);
                }
        }

        exitRule(listener) {
            if(listener instanceof NekoScriptListener ) {
                listener.exitDivision(this);
                }
        }

        accept(visitor) {
            if ( visitor instanceof NekoScriptVisitor ) {
                return visitor.visitDivision(this);
            } else {
                return visitor.visitChildren(this);
            }
        }


}

NekoScriptParser.DivisionContext = DivisionContext;

class NumberLiteralContext extends NumExpressionContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

        NUMBER() {
            return this.getToken(NekoScriptParser.NUMBER, 0);
        };

        enterRule(listener) {
            if(listener instanceof NekoScriptListener ) {
                listener.enterNumberLiteral(this);
                }
        }

        exitRule(listener) {
            if(listener instanceof NekoScriptListener ) {
                listener.exitNumberLiteral(this);
                }
        }

        accept(visitor) {
            if ( visitor instanceof NekoScriptVisitor ) {
                return visitor.visitNumberLiteral(this);
            } else {
                return visitor.visitChildren(this);
            }
        }


}

NekoScriptParser.NumberLiteralContext = NumberLiteralContext;

class FunctionDeclarationContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = NekoScriptParser.RULE_functionDeclaration;
    }

        ID() {
            return this.getToken(NekoScriptParser.ID, 0);
        };

        block() {
            return this.getTypedRuleContext(BlockContext,0);
        };

        paramList() {
            return this.getTypedRuleContext(ParamListContext,0);
        };

        enterRule(listener) {
            if(listener instanceof NekoScriptListener ) {
                listener.enterFunctionDeclaration(this);
                }
        }

        exitRule(listener) {
            if(listener instanceof NekoScriptListener ) {
                listener.exitFunctionDeclaration(this);
                }
        }

        accept(visitor) {
            if ( visitor instanceof NekoScriptVisitor ) {
                return visitor.visitFunctionDeclaration(this);
            } else {
                return visitor.visitChildren(this);
            }
        }


}



class ParamListContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = NekoScriptParser.RULE_paramList;
    }

        ID = function(i) {
                if(i===undefined) {
                        i = null;
                }
            if(i===null) {
                return this.getTokens(NekoScriptParser.ID);
            } else {
                return this.getToken(NekoScriptParser.ID, i);
            }
        };


        enterRule(listener) {
            if(listener instanceof NekoScriptListener ) {
                listener.enterParamList(this);
                }
        }

        exitRule(listener) {
            if(listener instanceof NekoScriptListener ) {
                listener.exitParamList(this);
                }
        }

        accept(visitor) {
            if ( visitor instanceof NekoScriptVisitor ) {
                return visitor.visitParamList(this);
            } else {
                return visitor.visitChildren(this);
            }
        }


}



class FunctionCallContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = NekoScriptParser.RULE_functionCall;
    }

        ID() {
            return this.getToken(NekoScriptParser.ID, 0);
        };

        argList() {
            return this.getTypedRuleContext(ArgListContext,0);
        };

        enterRule(listener) {
            if(listener instanceof NekoScriptListener ) {
                listener.enterFunctionCall(this);
                }
        }

        exitRule(listener) {
            if(listener instanceof NekoScriptListener ) {
                listener.exitFunctionCall(this);
                }
        }

        accept(visitor) {
            if ( visitor instanceof NekoScriptVisitor ) {
                return visitor.visitFunctionCall(this);
            } else {
                return visitor.visitChildren(this);
            }
        }


}



class ArgListContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = NekoScriptParser.RULE_argList;
    }

        expression = function(i) {
            if(i===undefined) {
                i = null;
            }
            if(i===null) {
                return this.getTypedRuleContexts(ExpressionContext);
            } else {
                return this.getTypedRuleContext(ExpressionContext,i);
            }
        };

        enterRule(listener) {
            if(listener instanceof NekoScriptListener ) {
                listener.enterArgList(this);
                }
        }

        exitRule(listener) {
            if(listener instanceof NekoScriptListener ) {
                listener.exitArgList(this);
                }
        }

        accept(visitor) {
            if ( visitor instanceof NekoScriptVisitor ) {
                return visitor.visitArgList(this);
            } else {
                return visitor.visitChildren(this);
            }
        }


}



class ImportStatementContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = NekoScriptParser.RULE_importStatement;
    }

        STRING() {
            return this.getToken(NekoScriptParser.STRING, 0);
        };

        enterRule(listener) {
            if(listener instanceof NekoScriptListener ) {
                listener.enterImportStatement(this);
                }
        }

        exitRule(listener) {
            if(listener instanceof NekoScriptListener ) {
                listener.exitImportStatement(this);
                }
        }

        accept(visitor) {
            if ( visitor instanceof NekoScriptVisitor ) {
                return visitor.visitImportStatement(this);
            } else {
                return visitor.visitChildren(this);
            }
        }


}



class WebSiteDeclarationContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = NekoScriptParser.RULE_webSiteDeclaration;
    }

        webSiteBlock() {
            return this.getTypedRuleContext(WebSiteBlockContext,0);
        };

        enterRule(listener) {
            if(listener instanceof NekoScriptListener ) {
                listener.enterWebSiteDeclaration(this);
                }
        }

        exitRule(listener) {
            if(listener instanceof NekoScriptListener ) {
                listener.exitWebSiteDeclaration(this);
                }
        }

        accept(visitor) {
            if ( visitor instanceof NekoScriptVisitor ) {
                return visitor.visitWebSiteDeclaration(this);
            } else {
                return visitor.visitChildren(this);
            }
        }


}



class WebSiteBlockContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = NekoScriptParser.RULE_webSiteBlock;
    }

        webSiteProperty = function(i) {
            if(i===undefined) {
                i = null;
            }
            if(i===null) {
                return this.getTypedRuleContexts(WebSitePropertyContext);
            } else {
                return this.getTypedRuleContext(WebSitePropertyContext,i);
            }
        };

        enterRule(listener) {
            if(listener instanceof NekoScriptListener ) {
                listener.enterWebSiteBlock(this);
                }
        }

        exitRule(listener) {
            if(listener instanceof NekoScriptListener ) {
                listener.exitWebSiteBlock(this);
                }
        }

        accept(visitor) {
            if ( visitor instanceof NekoScriptVisitor ) {
                return visitor.visitWebSiteBlock(this);
            } else {
                return visitor.visitChildren(this);
            }
        }


}



class WebSitePropertyContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = NekoScriptParser.RULE_webSiteProperty;
    }

        STRING() {
            return this.getToken(NekoScriptParser.STRING, 0);
        };

        styleBlock() {
            return this.getTypedRuleContext(StyleBlockContext,0);
        };

        block() {
            return this.getTypedRuleContext(BlockContext,0);
        };

        enterRule(listener) {
            if(listener instanceof NekoScriptListener ) {
                listener.enterWebSiteProperty(this);
                }
        }

        exitRule(listener) {
            if(listener instanceof NekoScriptListener ) {
                listener.exitWebSiteProperty(this);
                }
        }

        accept(visitor) {
            if ( visitor instanceof NekoScriptVisitor ) {
                return visitor.visitWebSiteProperty(this);
            } else {
                return visitor.visitChildren(this);
            }
        }


}



class StyleBlockContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = NekoScriptParser.RULE_styleBlock;
    }

        styleProperty = function(i) {
            if(i===undefined) {
                i = null;
            }
            if(i===null) {
                return this.getTypedRuleContexts(StylePropertyContext);
            } else {
                return this.getTypedRuleContext(StylePropertyContext,i);
            }
        };

        enterRule(listener) {
            if(listener instanceof NekoScriptListener ) {
                listener.enterStyleBlock(this);
                }
        }

        exitRule(listener) {
            if(listener instanceof NekoScriptListener ) {
                listener.exitStyleBlock(this);
                }
        }

        accept(visitor) {
            if ( visitor instanceof NekoScriptVisitor ) {
                return visitor.visitStyleBlock(this);
            } else {
                return visitor.visitChildren(this);
            }
        }


}



class StylePropertyContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = NekoScriptParser.RULE_styleProperty;
    }

        ID() {
            return this.getToken(NekoScriptParser.ID, 0);
        };

        STRING() {
            return this.getToken(NekoScriptParser.STRING, 0);
        };

        NUMBER() {
            return this.getToken(NekoScriptParser.NUMBER, 0);
        };

        enterRule(listener) {
            if(listener instanceof NekoScriptListener ) {
                listener.enterStyleProperty(this);
                }
        }

        exitRule(listener) {
            if(listener instanceof NekoScriptListener ) {
                listener.exitStyleProperty(this);
                }
        }

        accept(visitor) {
            if ( visitor instanceof NekoScriptVisitor ) {
                return visitor.visitStyleProperty(this);
            } else {
                return visitor.visitChildren(this);
            }
        }


}



class IfStatementContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = NekoScriptParser.RULE_ifStatement;
    }

        condition() {
            return this.getTypedRuleContext(ConditionContext,0);
        };

        block = function(i) {
            if(i===undefined) {
                i = null;
            }
            if(i===null) {
                return this.getTypedRuleContexts(BlockContext);
            } else {
                return this.getTypedRuleContext(BlockContext,i);
            }
        };

        enterRule(listener) {
            if(listener instanceof NekoScriptListener ) {
                listener.enterIfStatement(this);
                }
        }

        exitRule(listener) {
            if(listener instanceof NekoScriptListener ) {
                listener.exitIfStatement(this);
                }
        }

        accept(visitor) {
            if ( visitor instanceof NekoScriptVisitor ) {
                return visitor.visitIfStatement(this);
            } else {
                return visitor.visitChildren(this);
            }
        }


}



class ConditionContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = NekoScriptParser.RULE_condition;
    }

        expression = function(i) {
            if(i===undefined) {
                i = null;
            }
            if(i===null) {
                return this.getTypedRuleContexts(ExpressionContext);
            } else {
                return this.getTypedRuleContext(ExpressionContext,i);
            }
        };

        enterRule(listener) {
            if(listener instanceof NekoScriptListener ) {
                listener.enterCondition(this);
                }
        }

        exitRule(listener) {
            if(listener instanceof NekoScriptListener ) {
                listener.exitCondition(this);
                }
        }

        accept(visitor) {
            if ( visitor instanceof NekoScriptVisitor ) {
                return visitor.visitCondition(this);
            } else {
                return visitor.visitChildren(this);
            }
        }


}



class LoopStatementContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = NekoScriptParser.RULE_loopStatement;
    }

        ID() {
            return this.getToken(NekoScriptParser.ID, 0);
        };

        numExpression = function(i) {
            if(i===undefined) {
                i = null;
            }
            if(i===null) {
                return this.getTypedRuleContexts(NumExpressionContext);
            } else {
                return this.getTypedRuleContext(NumExpressionContext,i);
            }
        };

        block() {
            return this.getTypedRuleContext(BlockContext,0);
        };

        enterRule(listener) {
            if(listener instanceof NekoScriptListener ) {
                listener.enterLoopStatement(this);
                }
        }

        exitRule(listener) {
            if(listener instanceof NekoScriptListener ) {
                listener.exitLoopStatement(this);
                }
        }

        accept(visitor) {
            if ( visitor instanceof NekoScriptVisitor ) {
                return visitor.visitLoopStatement(this);
            } else {
                return visitor.visitChildren(this);
            }
        }


}



class BlockContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = NekoScriptParser.RULE_block;
    }

        statement = function(i) {
            if(i===undefined) {
                i = null;
            }
            if(i===null) {
                return this.getTypedRuleContexts(StatementContext);
            } else {
                return this.getTypedRuleContext(StatementContext,i);
            }
        };

        enterRule(listener) {
            if(listener instanceof NekoScriptListener ) {
                listener.enterBlock(this);
                }
        }

        exitRule(listener) {
            if(listener instanceof NekoScriptListener ) {
                listener.exitBlock(this);
                }
        }

        accept(visitor) {
            if ( visitor instanceof NekoScriptVisitor ) {
                return visitor.visitBlock(this);
            } else {
                return visitor.visitChildren(this);
            }
        }


}




NekoScriptParser.ProgramContext = ProgramContext; 
NekoScriptParser.StatementContext = StatementContext; 
NekoScriptParser.VariableDeclarationContext = VariableDeclarationContext; 
NekoScriptParser.ExpressionStatementContext = ExpressionStatementContext; 
NekoScriptParser.ExpressionContext = ExpressionContext; 
NekoScriptParser.NumExpressionContext = NumExpressionContext; 
NekoScriptParser.FunctionDeclarationContext = FunctionDeclarationContext; 
NekoScriptParser.ParamListContext = ParamListContext; 
NekoScriptParser.FunctionCallContext = FunctionCallContext; 
NekoScriptParser.ArgListContext = ArgListContext; 
NekoScriptParser.ImportStatementContext = ImportStatementContext; 
NekoScriptParser.WebSiteDeclarationContext = WebSiteDeclarationContext; 
NekoScriptParser.WebSiteBlockContext = WebSiteBlockContext; 
NekoScriptParser.WebSitePropertyContext = WebSitePropertyContext; 
NekoScriptParser.StyleBlockContext = StyleBlockContext; 
NekoScriptParser.StylePropertyContext = StylePropertyContext; 
NekoScriptParser.IfStatementContext = IfStatementContext; 
NekoScriptParser.ConditionContext = ConditionContext; 
NekoScriptParser.LoopStatementContext = LoopStatementContext; 
NekoScriptParser.BlockContext = BlockContext; 

module.exports = { NekoScriptParser };
