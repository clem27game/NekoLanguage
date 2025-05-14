# Limitations Actuelles de NekoScript

Ce document décrit les limitations actuelles de NekoScript v1.0. Ces limitations seront abordées dans les versions futures.

## Limitations de Syntaxe

### 1. Concaténation de chaînes

La concaténation de chaînes avec l'opérateur `+` n'est pas encore entièrement supportée. Pour l'instant, utilisez des chaînes de caractères complètes :

```
// Ne fonctionne pas encore :
neko = ("Bonjour, " + nom + "!");

// Utilisez plutôt :
neko = ("Bonjour, tout le monde!"); 
```

### 2. Variables dans les expressions d'impression

L'utilisation directe de variables dans les expressions d'impression peut causer des erreurs. Exemple :

```
// Ne fonctionne pas de manière fiable :
message = "Bonjour";
neko = (message);

// Utilisez plutôt :
message = "Bonjour";
neko = ("Bonjour");
```

### 3. Expressions conditionnelles complexes

Les expressions conditionnelles complexes avec opérateurs logiques (ET, OU) ne sont pas encore supportées.

### 4. Fonctions personnalisées

La définition et l'appel de fonctions personnalisées sont en cours de développement :

```
// Cette syntaxe n'est pas encore entièrement supportée :
nekFonction(param) {
    // corps de la fonction
}
```

## Fonctionnalités Supportées

NekoScript v1.0 supporte les fonctionnalités suivantes de manière fiable :

### 1. Affichage de texte

```
neko = ("Texte à afficher");
```

### 2. Déclaration de variables

```
nom = "NekoScript";
age = 42;
```

### 3. Opérations mathématiques

```
compteneko = 5 plus 3;       // Addition
compteneko = 10 moins 2;     // Soustraction
compteneko = 4 multiplier 3; // Multiplication
compteneko = 8 diviser 2;    // Division
```

### 4. Structures conditionnelles simples

```
age = 20;
nekSi(age plusGrandQue 18) {
    neko = ("Vous êtes majeur");
} nekSinon {
    neko = ("Vous êtes mineur");
}
```

### 5. Boucles simples

```
nekBoucle(i de 1 à 5) {
    neko = ("Itération");
}
```

## Feuille de Route pour les Versions Futures

Les fonctionnalités suivantes sont prévues pour les prochaines versions :

1. **NekoScript v1.1**
   - Support complet de la concaténation de chaînes
   - Amélioration de l'affichage des variables
   - Corrections de bugs pour les structures conditionnelles

2. **NekoScript v1.2**
   - Support complet des fonctions personnalisées
   - Ajout d'une bibliothèque standard étendue
   - Support des tableaux et collections

3. **NekoScript v2.0**
   - Support complet pour le développement web
   - Intégration avec les API externes
   - Création de packages et bibliothèques communautaires

## Comment Contribuer

Si vous souhaitez contribuer à l'amélioration de NekoScript, voici comment procéder :

1. Signaler des bugs via GitHub Issues
2. Proposer des améliorations de la syntaxe ou de nouvelles fonctionnalités
3. Contribuer au code source en soumettant des pull requests
4. Créer des bibliothèques et extensions pour la communauté

Pour plus d'informations, consultez [CONTRIBUTING.md](CONTRIBUTING.md).