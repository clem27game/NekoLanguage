# NekoScript 🐱

NekoScript est un langage de programmation indépendant basé sur le français, conçu pour rendre la programmation plus accessible aux francophones. Doté de sa propre syntaxe intuitive, de commandes en terminal et d'un système de gestion de packages, NekoScript permet de créer facilement des sites web, des jeux et des bots Discord.

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Dependencies](https://img.shields.io/badge/dependencies-Node.js%20>=%2014.0.0-orange)

## Installation

### Depuis GitHub (Recommandé)

```bash
# Cloner le dépôt
git clone https://github.com/clem27game/NekoLanguage

cd NekoLanguage 

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

// Méthode de base pour un site simple
neksite.créer {
  titre: "Mon Site NekoScript";
  description: "Un site web créé avec NekoScript";
  
  pages: [
    {
      titre: "Accueil",
      contenu: `
        <h1>Bienvenue sur mon site</h1>
        <p>Ce site a été créé avec NekoScript</p>
        <img src="chat.jpg" alt="Image d'un chat">
      `,
      nomFichier: "index.html"
    }
  ]
}
```

### Site web avec variables et contenu dynamique

#### Méthode recommandée (nouvelle approche)

```neko
// Importation du module neksite amélioré
nekImporter("neksite-module");

// Variables pour personnaliser le site
var titreSite = "Blog NekoScript";
var auteur = "Marie Dupont";
var couleurPrincipale = "#3498db";
var datePublication = "15 mai 2025";

// Création du contenu avec des variables
fonction creerContenuArticle(titre, date, contenu) {
  return `
    <article class="post">
      <h3>${titre}</h3>
      <div class="date">${date}</div>
      <p>${contenu}</p>
    </article>
  `;
}

// Liste des articles
var articles = [
  {
    titre: "Initiation à NekoScript",
    date: "2 mai 2025",
    contenu: "NekoScript est un langage de programmation en français qui simplifie le développement web et d'applications..."
  },
  {
    titre: "Créer un site avec NekoScript",
    date: "10 mai 2025",
    contenu: "Dans ce tutoriel, nous allons apprendre à créer un site web complet avec NekoScript et ses fonctionnalités intégrées..."
  }
];

// Génération du contenu HTML pour tous les articles
fonction genererTousLesArticles() {
  var htmlArticles = "";
  pour i de 0 à articles.length - 1 {
    htmlArticles = htmlArticles + creerContenuArticle(
      articles[i].titre,
      articles[i].date,
      articles[i].contenu
    );
  }
  return htmlArticles;
}

// Création du site avec neksite
neksite.créer {
  titre: titreSite,
  description: "Un blog créé avec NekoScript",
  auteur: auteur,
  couleurPrincipale: couleurPrincipale,
  couleurSecondaire: "#2ecc71",
  
  // Style personnalisé
  stylePersonnalise: `
    .post {
      border-left: 3px solid ${couleurPrincipale};
      padding-left: 1rem;
      margin: 2rem 0;
    }
    .date {
      color: #777;
      font-style: italic;
    }
    .header-banner {
      background-color: ${couleurPrincipale};
      color: white;
      padding: 2rem;
      margin-bottom: 2rem;
      text-align: center;
    }
  `,
  
  // Pages du site
  pages: [
    {
      titre: "Accueil",
      nomFichier: "index.html",
      contenu: `
        <div class="header-banner">
          <h1>${titreSite}</h1>
          <p>Par ${auteur} - Dernière mise à jour: ${datePublication}</p>
        </div>
        
        <div class="articles">
          <h2>Articles récents</h2>
          ${genererTousLesArticles()}
        </div>
        
        <div class="feature-box">
          <h3>À propos de ce blog</h3>
          <p>Ce blog présente des tutoriels et astuces sur NekoScript, un langage de programmation en français.</p>
          <a href="a-propos.html" class="btn">En savoir plus</a>
        </div>
      `
    },
    {
      titre: "À propos",
      nomFichier: "a-propos.html",
      contenu: `
        <div class="header-banner">
          <h1>À propos de ${titreSite}</h1>
        </div>
        
        <div class="contenu">
          <h2>Notre mission</h2>
          <p>${titreSite} a été créé pour partager des connaissances sur NekoScript et aider les francophones à découvrir la programmation.</p>
          
          <h2>L'auteur</h2>
          <p>${auteur} est une développeuse passionnée qui travaille avec NekoScript depuis sa création.</p>
          
          <a href="index.html" class="btn">Retour à l'accueil</a>
        </div>
      `
    }
  ]
}
```

#### Méthode alternative (création directe des fichiers HTML)

```neko
nekImporter("interne");

// Configuration du site
var config = {
  titre: "Blog NekoScript",
  auteur: "Marie Dupont",
  couleurTheme: "#3498db",
  articles: [
    { titre: "Initiation à NekoScript", date: "2 mai 2025", contenu: "NekoScript est un langage..." },
    { titre: "Créer un site avec NekoScript", date: "10 mai 2025", contenu: "Dans ce tutoriel..." }
  ]
};

// Fonction pour générer la liste d'articles en HTML
fonction genererArticlesHTML(listeArticles) {
  var html = "";
  pour i de 0 à listeArticles.length - 1 {
    html = html + "<article class='post'>";
    html = html + "<h3>" + listeArticles[i].titre + "</h3>";
    html = html + "<div class='date'>" + listeArticles[i].date + "</div>";
    html = html + "<p>" + listeArticles[i].contenu + "</p>";
    html = html + "</article>";
  }
  return html;
}

// Création du HTML complet pour la page d'accueil
var pageAccueilHTML = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${config.titre}</title>
  <style>
    body { font-family: 'Segoe UI', sans-serif; line-height: 1.6; }
    .header { background-color: ${config.couleurTheme}; color: white; padding: 2rem; }
    .post { border-left: 3px solid ${config.couleurTheme}; padding-left: 1rem; margin: 2rem 0; }
    .date { color: #777; font-style: italic; }
    .container { max-width: 800px; margin: 0 auto; padding: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${config.titre}</h1>
      <p>Par ${config.auteur}</p>
    </div>
    <div class="articles">
      ${genererArticlesHTML(config.articles)}
    </div>
  </div>
</body>
</html>`;

// Écriture du fichier HTML
nekExecuterJS(`
  const fs = require('fs');
  const path = require('path');
  
  // Créer le répertoire site-output s'il n'existe pas
  const outputDir = path.join(process.cwd(), 'site-output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Écrire le fichier HTML
  fs.writeFileSync(
    path.join(outputDir, 'index.html'),
    \`${pageAccueilHTML}\`,
    'utf8'
  );
  
  console.log('Site web créé avec succès dans ' + outputDir);
`);
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

## Guide détaillé pour créer un site web avec NekoScript

NekoScript offre plusieurs approches pour créer des sites web, des plus simples aux plus complexes. Cette section vous guidera à travers les différentes méthodes, avec un accent particulier sur l'approche recommandée pour intégrer facilement des variables personnalisées.

### Méthode 1: Module neksite-module (recommandée)

Le module `neksite-module` est l'approche la plus simple et la plus fiable pour créer des sites web avec NekoScript. Ce module gère correctement les variables et offre une personnalisation complète.

#### Étape 1: Importer le module

```neko
nekImporter("neksite-module");
```

#### Étape 2: Définir vos variables personnalisées

```neko
var titreSite = "Mon Super Site";
var couleurPrincipale = "#9b59b6"; // Violet
var couleurSecondaire = "#f1c40f"; // Jaune
var auteur = "Votre Nom";
```

#### Étape 3: Créer votre site avec des pages multiples

```neko
neksite.créer {
  // Configuration du site
  titre: titreSite,
  description: "Description de votre site",
  auteur: auteur,
  couleurPrincipale: couleurPrincipale,
  couleurSecondaire: couleurSecondaire,
  
  // Ajouter du CSS personnalisé
  stylePersonnalise: `
    .monElement {
      color: ${couleurPrincipale};
      border: 2px solid ${couleurSecondaire};
    }
  `,
  
  // Définir les pages du site
  pages: [
    {
      titre: "Accueil",
      nomFichier: "index.html", // Important pour la page d'accueil
      contenu: `
        <h1>Bienvenue sur ${titreSite}</h1>
        <p>Un site créé avec NekoScript par ${auteur}</p>
        
        <div class="monElement">
          Cet élément utilise les couleurs personnalisées
        </div>
      `
    },
    {
      titre: "Contact",
      nomFichier: "contact.html",
      contenu: `
        <h1>Contactez-nous</h1>
        <p>Envoyez un message à ${auteur}</p>
        
        <form>
          <input type="text" placeholder="Votre nom">
          <input type="email" placeholder="Votre email">
          <button type="submit" style="background-color: ${couleurPrincipale}">
            Envoyer
          </button>
        </form>
      `
    }
  ]
}
```

#### Astuces pour la méthode neksite-module

- Utilisez toujours `var` pour déclarer vos variables
- Utilisez des template literals (avec des backticks \`) pour intégrer des variables dans votre HTML
- Définissez des fonctions pour générer du contenu répétitif
- N'oubliez pas de nommer la page d'accueil `index.html`

### Méthode 2: Génération directe de HTML

Si vous avez besoin d'un contrôle total sur le HTML généré, vous pouvez utiliser cette méthode alternative :

```neko
nekImporter("interne");

// Créer le HTML avec vos variables
var titre = "Mon Site";
var couleur = "#3498db";

var htmlComplet = `<!DOCTYPE html>
<html>
<head>
  <title>${titre}</title>
  <style>
    body { color: ${couleur}; }
  </style>
</head>
<body>
  <h1>${titre}</h1>
</body>
</html>`;

// Générer le fichier
nekExecuterJS(`
  const fs = require('fs');
  const path = require('path');
  
  // Créer le dossier de sortie
  const outputDir = 'site-output';
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Écrire le fichier HTML
  fs.writeFileSync(
    path.join(outputDir, 'index.html'),
    \`${htmlComplet}\`,
    'utf8'
  );
  
  console.log('Site créé dans: ' + outputDir);
`);
```

### Méthode 3: Portfolio complet (exemple avancé)

Voir l'exemple complet du portfolio dans `examples/demo-neksite.neko` qui montre comment créer un site portfolio professionnel avec des projets, une galerie et des formulaires de contact.

### Visualisation et déploiement

Une fois votre site généré, vous pouvez le visualiser :

```bash
# Lancer le serveur pour voir votre site
node serveur-site.js

# Le site sera accessible sur http://localhost:5000
```

## Documentation

Pour plus d'informations, consultez les documents suivants dans le répertoire `docs/` :

- [Guide de démarrage rapide](docs/QUICKSTART.md) - Pour commencer à utiliser NekoScript
- [Limitations actuelles](docs/LIMITATIONS.md) - Informations sur les limitations de la version actuelle
- [Guide de création de sites web](docs/GUIDE-SITES.md) - Guide détaillé sur la création de sites web
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