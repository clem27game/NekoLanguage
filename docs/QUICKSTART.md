# Guide de Démarrage Rapide - NekoScript

Bienvenue dans NekoScript, un langage de programmation en français conçu pour être accessible et intuitif ! Ce guide vous aidera à installer et à commencer à programmer avec NekoScript.

## Installation

### Prérequis

- Node.js v12.0.0 ou supérieur
- npm (généralement installé avec Node.js)

### Installation via npm

```bash
# Installation globale de NekoScript
npm install -g neko-script

# Vérifiez l'installation
neko-script version
```

## Votre Premier Programme NekoScript

Créez un fichier nommé `hello.neko` avec le contenu suivant :

```
// Mon premier programme NekoScript
neko = ("Bonjour, monde!");

// Variable
nom = "NekoScript";
neko = ("Je m'appelle");
neko = ("NekoScript");

// Calculs
neko = ("Démonstration de calculs:");
compteneko = 5 plus 3;
compteneko = 10 moins 2;
compteneko = 4 multiplier 3;
compteneko = 8 diviser 2;

// Structure conditionnelle
age = 18;
nekSi(age plusGrandQue 17) {
    neko = ("Vous êtes majeur!");
} nekSinon {
    neko = ("Vous êtes mineur!");
}

// Boucle
neko = ("Démonstration d'une boucle:");
nekBoucle(i de 1 à 3) {
    neko = ("Itération numéro");
    compteneko = i;
}
```

### Exécution du Programme

```bash
# Dans le terminal
neko-script exécuter hello.neko
```

Vous devriez voir la sortie suivante :

```
Bonjour, monde!
Je m'appelle
NekoScript
Démonstration de calculs:
8
8
12
4
Vous êtes majeur!
Démonstration d'une boucle:
Itération numéro
1
Itération numéro
2
Itération numéro
3
```

## Concepts de Base

### 1. Affichage

Pour afficher du texte dans la console :

```
neko = ("Texte à afficher");
```

### 2. Variables

Les variables sont créées simplement en les assignant :

```
nom = "NekoScript";
age = 42;
decimal = 3.14;
```

### 3. Opérations Mathématiques

NekoScript utilise des mots en français pour les opérations :

```
resultat = 5 plus 3;       // Addition (8)
resultat = 10 moins 2;     // Soustraction (8)
resultat = 4 multiplier 3; // Multiplication (12)
resultat = 8 diviser 2;    // Division (4)
```

Pour afficher un résultat numérique :

```
compteneko = resultat;
```

### 4. Conditions

Les structures conditionnelles utilisent `nekSi`, `nekSinonSi` et `nekSinon` :

```
temperature = 25;

nekSi(temperature plusGrandQue 30) {
    neko = ("Il fait très chaud");
} nekSinonSi(temperature plusGrandQue 20) {
    neko = ("Il fait bon");
} nekSinonSi(temperature plusGrandQue 10) {
    neko = ("Il fait frais");
} nekSinon {
    neko = ("Il fait froid");
}
```

### 5. Boucles

Les boucles sont créées avec `nekBoucle` :

```
nekBoucle(i de 1 à 5) {
    neko = ("Itération:");
    compteneko = i;
}
```

## Exemples Additionnels

Consultez le répertoire `examples/` pour plus d'exemples de code NekoScript :

- `simple.neko` : Exemple basique
- `compatibilite.neko` : Fonctionnalités compatibles
- `demo-complet.neko` : Démonstration complète
- `webSite.neko` : Création de site web
- `simpleGame.neko` : Exemple de jeu simple

## Commandes Utiles

```bash
# Exécuter un script
neko-script exécuter monscript.neko

# Télécharger un package
neko-script télécharger nom-package

# Installer une bibliothèque
neko-script librairie ma-librairie

# Lister les packages installés
neko-script lister

# Obtenir de l'aide
neko-script aide
```

## Ressources Additionnelles

- [Documentation Complète](https://nekoscript.org/docs)
- [Limitations Actuelles](LIMITATIONS.md)
- [Guide de Contribution](CONTRIBUTING.md)
- [Site Officiel](https://nekoscript.org)

## Support & Communauté

- GitHub : https://github.com/nekoscript/neko-script
- Discord : https://discord.gg/nekoscript
- Forum : https://forum.nekoscript.org

---

Profitez de NekoScript et n'hésitez pas à nous faire part de vos retours !