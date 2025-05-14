grammar NekoScript;

// Parser Rules
program: statement* EOF;

statement
    : variableDeclaration
    | expressionStatement
    | functionDeclaration
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
    | 'neko' '=' '(' expr=expression ')' # PrintExpressionComplex
    | 'nekimg' '=' '(' STRING ')' # ImageExpression
    | functionCall # FunctionCallExpression
    | numExpression # NumberExpression
    | STRING # StringExpression
    | ID # IdentifierExpression
    | '(' expression ')' # ParenExpression
    | left=expression PLUS right=expression # StringConcatenation
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
    | ID '(' paramList? ')' block  // Support pour la forme nekBonjour(nom) { ... }
    ;

paramList
    : ID (',' ID)*
    ;

functionCall
    : 'nek' ID '(' argList? ')'
    ;

argList
    : expression (',' expression)*
    ;

importStatement
    : 'nekImporter' '(' STRING ')' ';'
    ;

webSiteDeclaration
    : 'neksite.créer' ',' 'script' webSiteBlock
    ;

webSiteBlock
    : '{' webSiteProperty* '}'
    ;

webSiteProperty
    : 'contenu' ':' '(' STRING ')' ','
    | 'titre' ':' STRING ','
    | 'lang' ':' STRING ','
    | 'couleur-de-fond' ':' STRING ','
    | 'style' styleBlock
    | 'script' block
    ;

styleBlock
    : '{' styleProperty* '}'
    ;

styleProperty
    : ID ':' (STRING | NUMBER) ','
    ;

ifStatement
    : 'nekSi' '(' condition ')' block ('nekSinon' block)?
    ;

condition
    : expression
    | expression 'est' expression
    | expression 'plusGrandQue' expression
    | expression 'plusPetitQue' expression
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
PLUS: '+' ;
COMMENT: '//' .*? ('\n' | EOF) -> skip ;
WS: [ \t\r\n]+ -> skip ;
