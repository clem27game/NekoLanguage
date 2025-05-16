# NekoScript 🐱

NekoScript est un langage de programmation indépendant basé sur le français, conçu pour rendre la programmation plus accessible aux francophones. Doté de sa propre syntaxe intuitive, de commandes en terminal et d'un système de gestion de packages, NekoScript permet de créer facilement des sites web, des jeux et des bots Discord.

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Dependencies](https://img.shields.io/badge/dependencies-Node.js%20>=%2014.0.0-orange)

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

- Node.js 14.0.0 ou supérieur
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

```neko
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

### Création d'un site web simple

```neko
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

### Site web avec variables et contenu dynamique

```neko
nekImporter("neksite");

// Configuration du site
config = {
  titre: "Blog NekoScript",
  auteur: "Marie Dupont",
  couleurTheme: "#3498db",
  articles: [
    { titre: "Initiation à NekoScript", date: "2 mai 2025", contenu: "NekoScript est un langage..." },
    { titre: "Créer un site avec NekoScript", date: "10 mai 2025", contenu: "Dans ce tutoriel..." }
  ]
};

// Fonction pour générer la liste d'articles
fonction genererArticles(listeArticles) {
  html = "";
  pour i de 0 à listeArticles.length - 1 {
    html = html + "<article class='post'>";
    html = html + "<h3>" + listeArticles[i].titre + "</h3>";
    html = html + "<div class='date'>" + listeArticles[i].date + "</div>";
    html = html + "<p>" + listeArticles[i].contenu + "</p>";
    html = html + "</article>";
  }
  return html;
}

// Création du site avec les variables
neksite.créer {
  titre: config.titre;
  styleGlobal: "
    body { font-family: 'Segoe UI', sans-serif; line-height: 1.6; }
    .header { background-color: " + config.couleurTheme + "; color: white; padding: 2rem; }
    .post { border-left: 3px solid " + config.couleurTheme + "; padding-left: 1rem; margin: 2rem 0; }
    .date { color: #777; font-style: italic; }
  ";
  
  page = "Accueil" {
    contenu: "
      <div class='header'>
        <h1>" + config.titre + "</h1>
        <p>Par " + config.auteur + "</p>
      </div>
      <div class='articles'>
        " + genererArticles(config.articles) + "
      </div>
    ";
  }
}
```

### Bot Discord interactif

```neko
nekImporter("discordnek");

// Initialiser le bot
token = "VOTRE_TOKEN_DISCORD"; // À remplacer par votre token Discord
nekDiscordInitialiser(token);
nekDiscordConnecter();
nekDiscordDefinirStatus("en ligne");
nekDiscordDefinirActivite("joue", "avec NekoScript 2.0");

// Ajouter une commande slash
nekDiscordAjouterCommande("bonjour", "Une salutation personnalisée", fonction(interaction) {
  nekExecuterJS(`
    interaction.reply({
      content: "Bonjour ! Je suis un bot créé avec NekoScript 2.0!",
      ephemeral: false
    });
  `);
});

// Ajouter une commande avec choix interactifs (boutons)
nekDiscordAjouterCommande("menu", "Affiche un menu interactif", fonction(interaction) {
  // Créer un embed
  embedMenu = nekDiscordCreerEmbed(
    "Menu NekoScript", 
    "Choisissez une option:", 
    "#9b59b6", 
    [
      { name: "🐱 À propos", value: "Informations sur NekoScript", inline: vrai },
      { name: "📚 Commandes", value: "Liste des commandes disponibles", inline: vrai }
    ]
  );
  
  // Créer les boutons
  btnInfo = nekDiscordCreerBouton("btn_info", "Informations", "primary", "ℹ️");
  btnCommandes = nekDiscordCreerBouton("btn_commandes", "Commandes", "success", "📋");
  
  // Assembler les boutons dans une ligne
  ligneBoutons = nekDiscordCreerLigneBoutons([btnInfo, btnCommandes]);
  
  // Envoyer le message avec embed et boutons
  nekExecuterJS(`
    interaction.reply({
      embeds: [${embedMenu}],
      components: [${ligneBoutons}]
    });
  `);
});

// Gérer les clics sur les boutons
nekDiscordAjouterHandlerBouton("btn_info", fonction(interaction) {
  nekExecuterJS(`
    interaction.reply({
      content: "**NekoScript** est un langage de programmation en français créé pour simplifier le développement!",
      ephemeral: true
    });
  `);
});

nekDiscordAjouterHandlerBouton("btn_commandes", fonction(interaction) {
  nekExecuterJS(`
    interaction.reply({
      content: "**Commandes disponibles:**\\n- /bonjour : Une salutation personnalisée\\n- /menu : Affiche ce menu interactif",
      ephemeral: true
    });
  `);
});

// Configurer les handlers et enregistrer les commandes
nekDiscordConfigurerHandlers();
nekDiscordEnregistrerCommandes();
```

### Intégration avec JavaScript natif et création de package

```neko
// Création d'un package "utilitaires" pour NekoScript

// Code JavaScript natif pour des opérations avancées
jsCode = `
// Fonctions utilitaires JavaScript
function formatDate(date) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('fr-FR', options);
}

function slugify(text) {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

module.exports = {
  formatDate,
  slugify,
  generateUniqueId
};
`;

// Charger le code JS comme module NekoScript
nekPackageManager.enregistrerModuleJS("utilitaires", jsCode);

// Fonctions NekoScript qui utilisent les fonctions JS
fonction nekFormatDate(dateStr) {
  return nekExecuterJS(`
    const utils = require('./utilitaires');
    return utils.formatDate('${dateStr}');
  `);
}

fonction nekSlugifier(texte) {
  return nekExecuterJS(`
    const utils = require('./utilitaires');
    return utils.slugify('${texte}');
  `);
}

fonction nekGenererIdUnique() {
  return nekExecuterJS(`
    const utils = require('./utilitaires');
    return utils.generateUniqueId();
  `);
}

// Exporter le package
nekExporter({
  nekFormatDate: nekFormatDate,
  nekSlugifier: nekSlugifier,
  nekGenererIdUnique: nekGenererIdUnique
});
```

## Structure du projet

```
neko-script/
├── bin/               # Fichiers exécutables
├── src/
│   ├── cli/           # Interface en ligne de commande
│   ├── grammar/       # Grammaire ANTLR4
│   ├── interpreter/   # Interpréteur du langage
│   ├── modules/       # Modules intégrés (neksite, etc.)
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
- [Guide de publication](docs/PUBLISHING.md) - Instructions pour publier NekoScript sur GitHub et npm

## Résolution des problèmes courants

### Erreur "Cannot find module ANTLR4"

Si vous rencontrez cette erreur lors de l'exécution de NekoScript, cela signifie que la dépendance ANTLR4 n'est pas correctement installée. Il existe deux méthodes pour résoudre ce problème :

#### Solution 1 : Script de correction automatique

Utilisez notre script de correction automatique des dépendances :

```bash
# Dans le répertoire où vous avez installé NekoScript
chmod +x fix-dependencies.sh
./fix-dependencies.sh
```

#### Solution 2 : Installation manuelle des dépendances

```bash
# Dans le répertoire où vous avez installé NekoScript
npm install antlr4 sqlite3 --save

# Si vous avez installé NekoScript globalement
npm install -g antlr4 sqlite3
```

Assurez-vous également que votre version de Node.js est au moins 12.0.0 ou supérieure.

Si ces solutions ne fonctionnent pas, essayez de réinstaller complètement NekoScript :

```bash
# Désinstaller puis réinstaller
npm uninstall -g neko-script
npm install -g .
```

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