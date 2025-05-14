# NekoScript 🐱

NekoScript est un langage de programmation indépendant basé sur le français, conçu pour rendre la programmation plus accessible aux francophones. Doté de sa propre syntaxe intuitive, de commandes en terminal et d'un système de gestion de packages, NekoScript permet de créer facilement des sites web, des jeux et des bots Discord.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Dependencies](https://img.shields.io/badge/dependencies-Node.js%20>=%2012.0.0-orange)

## Installation

### Depuis GitHub (Recommandé)

```bash
# Cloner le dépôt
git clone https://github.com/votre-username/nekoscript.git
cd nekoscript

# Option 1: Installation automatique (Linux/Mac)
chmod +x install.sh
./install.sh

# Option 2: Installation manuelle
npm install -g .
```

### Prérequis

- Node.js 12.0.0 ou supérieur
- npm (inclus avec Node.js)

### Vérification de l'installation

```bash
# Vérifier la version installée
neko-script version

# Afficher l'aide
neko-script aide

# Exécuter un exemple
neko-script exécuter examples/demo-rapide.neko
```

### Installation future via NPM

```bash
# Une fois publié sur npm
npm install -g neko-script
```

## Caractéristiques

- 🇫🇷 **Syntaxe en français** : Commandes et structures en français pour une compréhension intuitive
- 📦 **Système de packages** : Création, partage et réutilisation de bibliothèques communautaires
- 🔄 **Multi-plateformes** : Fonctionne sur Windows, macOS et Linux
- 🧩 **Extensible** : Peut être étendu avec JavaScript, Python et d'autres langages
- 🌐 **Support web** : Création facilitée de sites web
- 🎮 **Développement de jeux** : Fonctionnalités pour la création de jeux simples
- 🤖 **Bots Discord** : Création simplifiée de bots Discord

## Exemples de code

### Exemple simple

```
// Affichage et variables
neko = ("Bonjour, chat!");
nom = "NekoScript";
age = 1;

// Calculs mathématiques
compteneko = 5 plus 3;
compteneko = 10 moins 2;
compteneko = 4 multiplier 3;
compteneko = 8 diviser 2;
```

### Création d'un site web

```
nekImporter("neksite");

neksite.créer {
  page = "Accueil" {
    style {
      couleurFond: "#f5f5f5";
      police: "Arial";
    }
    
    neksite.titre("Bienvenue sur mon site");
    neksite.paragraphe("Créé avec NekoScript");
    neksite.image("chat.jpg");
  }
}
```

## Structure du projet

```
neko-script/
├── bin/               # Fichiers exécutables
├── src/
│   ├── cli/           # Interface en ligne de commande
│   ├── grammar/       # Grammaire ANTLR4
│   ├── interpreter/   # Interpréteur du langage
│   └── packageManager/# Gestionnaire de packages
├── examples/          # Exemples de scripts
├── docs/              # Documentation détaillée
├── public/            # Site web et ressources
└── README.md          # Documentation principale
```

## Documentation

Pour plus d'informations, consultez les documents suivants dans le répertoire `docs/` :

- [Guide de démarrage rapide](docs/QUICKSTART.md) - Pour commencer à utiliser NekoScript
- [Limitations actuelles](docs/LIMITATIONS.md) - Informations sur les limitations de la version actuelle
- [Guide de contribution](docs/CONTRIBUTING.md) - Comment contribuer au projet

## Commandes en terminal

```bash
# Exécuter un script
neko-script exécuter mon-script.neko

# Télécharger un package
neko-script télécharger nom-package

# Installer une bibliothèque
neko-script librairie ma-librairie

# Publier un package
neko-script publish mon-package.neko

# Lister les packages disponibles
neko-script lister

# Afficher l'aide
neko-script aide
```

## Premiers pas avec NekoScript

### Création d'un fichier NekoScript

1. Créez un fichier avec l'extension `.neko`, par exemple `mon-programme.neko`
2. Ouvrez-le avec votre éditeur de texte préféré
3. Écrivez votre code NekoScript (voir exemples ci-dessous)
4. Exécutez-le avec la commande `neko-script exécuter mon-programme.neko`

### Exemple pour débuter

```
// mon-programme.neko
neko = ("Mon premier programme NekoScript!");
neko = ("Créé le " + "2023-03-15");

// Calculs simples
a = 42;
b = 8;
resultat = a plus b;

neko = ("Le résultat est:");
compteneko = resultat;
```

## Fonctionnalités principales

### Affichage
```
// Affiche du texte dans la console
neko = ("Texte à afficher");

// Affiche un nombre dans la console
compteneko = 42;
```

### Variables
```
// Définition de variables
nom = "Valeur";
nombre = 42;
estVrai = vrai;
```

### Opérations mathématiques
```
// Opérations de base
compteneko = 5 plus 3;       // Addition
compteneko = 10 moins 2;     // Soustraction
compteneko = 4 multiplier 3; // Multiplication
compteneko = 8 diviser 2;    // Division

// Avec variables
a = 10;
b = 5;
resultat = a plus b;
compteneko = resultat;
```

### Fonctions
```
nekBonjour(nom) {
  neko = ("Bonjour, " + nom + "!");
}

nekBonjour("Utilisateur");
```

### Conditions
```
nekSi(age plusGrandQue 18) {
  neko = ("Vous êtes majeur!");
} nekSinon {
  neko = ("Vous êtes mineur!");
}
```

### Boucles
```
nekBoucle(i de 1 à 5) {
  neko = ("Itération " + i);
}
```

## Extension avec Node.js

NekoScript peut être étendu avec des bibliothèques Node.js :

```javascript
// discord-lib.js
const Discord = require('discord.js');

module.exports = {
  créerBot: function(token) {
    const client = new Discord.Client();
    client.login(token);
    return client;
  },
  envoyerMessage: function(client, channel, message) {
    const chan = client.channels.cache.get(channel);
    if (chan) chan.send(message);
  }
};
```

## Contribuer

Les contributions sont les bienvenues ! N'hésitez pas à soumettre des pull requests ou à signaler des bugs.

## Licence

MIT

## Contact

Pour toute question ou suggestion, n'hésitez pas à nous contacter.