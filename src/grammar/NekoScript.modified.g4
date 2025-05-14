grammar NekoScript;

// Parser Rules
program: statement* EOF;

statement
    : variableDeclaration
    | expressionStatement
    | functionDeclaration
    | functionCall ';'
    | importStatement
    | webSiteDeclaration
    | ifStatement
    | loopStatement
    | COMMENT
    ;

variableDeclaration
    : ID '=' expression ';'
    | 'compteneko' '=' numExpression ';'
    ;

expressionStatement
    : expression ';'
    ;

expression
    : 'neko' '=' '(' STRING ')' # PrintExpression
    | 'neko' '=' '(' expression ')' # PrintExpressionComplex
    | 'nekimg' '=' '(' STRING ')' # ImageExpression
    | functionCall # FunctionCallExpression
    | numExpression # NumberExpression
    | STRING # StringExpression
    | ID # IdentifierExpression
    | '(' expression ')' # ParenExpression
    | stringConcatenation # StringConcatExpression
    ;

stringConcatenation
    : expression '+' expression
    ;

numExpression
    : NUMBER # NumberLiteral
    | ID # NumIdentifier
    | numExpression 'plus' numExpression # Addition
    | numExpression 'moins' numExpression # Subtraction
    | numExpression 'multiplier' numExpression # Multiplication
    | numExpression 'diviser' numExpression # Division
    ;

functionDeclaration
    : 'nek' ID '(' paramList? ')' block
    ;

paramList
    : ID (',' ID)*
    ;

functionCall
    : ('nek' ID | ID) '(' argList? ')'
    ;

argList
    : expression (',' expression)*
    ;

importStatement
    : 'nekImporter' '(' STRING ')' ';'
    ;

webSiteDeclaration
    : 'neksite.créer' webSiteBlock
    ;

webSiteBlock
    : '{' webSiteProperty* '}'
    ;

webSiteProperty
    : 'page' '=' STRING '{' (webSiteProperty | styleBlock)* '}'
    | 'titre' ':' STRING ';'
    | 'contenu' ':' STRING ';'
    | 'image' ':' STRING ';'
    | 'lien' ':' STRING ',' STRING ';'
    ;

styleBlock
    : 'style' '{' styleProperty* '}'
    ;

styleProperty
    : ID ':' (STRING | NUMBER) ';'
    ;

ifStatement
    : 'nekSi' '(' condition ')' block ('nekSinonSi' '(' condition ')' block)* ('nekSinon' block)?
    ;

condition
    : expression 'estEgal' expression
    | expression 'plusGrandQue' expression
    | expression 'plusPetitQue' expression
    | expression
    ;

loopStatement
    : 'nekBoucle' '(' ID 'de' numExpression 'à' numExpression ')' block
    ;

block
    : '{' statement* '}'
    ;

// Lexer Rules
ID: [a-zA-Z_][a-zA-Z0-9_]* ;
NUMBER: [0-9]+ ('.' [0-9]+)? ;
STRING: '"' (~["\r\n] | '\\"')* '"' ;
COMMENT: '//' .*? ('\n' | EOF) -> skip ;
WS: [ \t\r\n]+ -> skip ;