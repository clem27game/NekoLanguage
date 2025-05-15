# Guide d'utilisation du package DiscordNek

Ce guide vous explique comment créer des bots Discord facilement avec NekoScript en utilisant le package **discordnek**.

## Table des matières

1. [Installation des prérequis](#1-installation-des-prérequis)
2. [Création d'un bot Discord](#2-création-dun-bot-discord)
3. [Utilisation du package discordnek](#3-utilisation-du-package-discordnek)
4. [Exemples de fonctionnalités](#4-exemples-de-fonctionnalités)
5. [Publication de votre propre package](#5-publication-de-votre-propre-package)

## 1. Installation des prérequis

Avant d'utiliser discordnek, vous devez installer discord.js :

```bash
# Exécuter le script d'installation des dépendances
neko-script exécuter examples/installer-dependencies-discord.neko
```

## 2. Création d'un bot Discord

1. Rendez-vous sur [le portail développeur Discord](https://discord.com/developers/applications)
2. Cliquez sur "New Application" et donnez un nom à votre application
3. Allez dans l'onglet "Bot" et cliquez sur "Add Bot"
4. Copiez le token du bot (c'est confidentiel, ne le partagez jamais !)
5. Activez les "Privileged Gateway Intents" (MESSAGE CONTENT, SERVER MEMBERS, PRESENCE)
6. Générez un lien d'invitation pour votre bot avec les permissions administrateur :
   ```
   https://discord.com/api/oauth2/authorize?client_id=VOTRE_APP_ID&permissions=8&scope=bot%20applications.commands
   ```
   (Remplacez VOTRE_APP_ID par l'ID de votre application)
7. Ouvrez ce lien et invitez le bot sur votre serveur

## 3. Utilisation du package discordnek

### Importation du package

Si vous avez déjà installé le package globalement :

```neko
// Importer le module discordnek
nekImporter("discordnek");
```

Sinon, importez-le depuis le chemin local :

```neko
// Importer le module discordnek depuis le chemin local
nekImporterFichier("./examples/discordnek.neko");
```

### Configuration de base

```neko
// Initialiser le bot avec votre token
nekDiscordInitialiser("VOTRE_TOKEN_DISCORD");

// Connecter le bot
nekDiscordConnecter();

// Configurer le statut et l'activité
nekDiscordDefinirStatus("en ligne");
nekDiscordDefinirActivite("joue", "avec NekoScript");
```

### Ajout de commandes slash

```neko
// Ajouter une commande slash simple
nekDiscordAjouterCommande("bonjour", "Dit bonjour", fonction(interaction) {
  nekExecuterJS(`
    interaction.reply("Bonjour ! Je suis un bot créé avec NekoScript !");
  `);
});

// Enregistrer les commandes slash
nekDiscordEnregistrerCommandes();

// Configurer le gestionnaire de commandes
nekDiscordConfigurerHandlerCommandes();
```

### Écoute d'événements

```neko
// Écouter l'événement de connexion réussie
nekDiscordEcouterEvenement("ready", fonction() {
  nekExecuterJS(`
    console.log('Bot connecté en tant que: ' + global.discordClient.user.tag);
  `);
});

// Écouter les messages
nekDiscordEcouterEvenement("messageCreate", fonction(message) {
  nekExecuterJS(`
    if (message.author.bot) return; // Ignorer les messages des bots
    
    if (message.content.toLowerCase() === 'salut') {
      message.reply('Salut ! Comment ça va ?');
    }
  `);
});
```

## 4. Exemples de fonctionnalités

### Créer et envoyer un embed

```neko
// Créer un embed coloré
var monEmbed = nekDiscordCreerEmbed(
  "Titre de l'embed",
  "Description de l'embed",
  "#3498db",
  [
    { name: "Champ 1", value: "Valeur 1", inline: vrai },
    { name: "Champ 2", value: "Valeur 2", inline: vrai }
  ],
  "https://example.com/image.png" // URL d'une image (optionnel)
);

// Envoyer l'embed dans un canal
nekDiscordEnvoyerEmbed("ID_DU_CANAL", monEmbed);
```

### Bot avec plusieurs commandes

```neko
// Commande d'information
nekDiscordAjouterCommande("info", "Affiche des informations sur le bot", fonction(interaction) {
  nekExecuterJS(`
    interaction.reply({
      embeds: [
        global.createEmbed(
          "NekoScript Bot",
          "Un bot Discord créé avec NekoScript",
          "#ff9900",
          [
            { name: "Version", value: "1.0.0", inline: true },
            { name: "Créateur", value: "Votre nom", inline: true },
            { name: "Langage", value: "NekoScript", inline: true }
          ]
        )
      ]
    });
  `);
});

// Commande pour lancer un dé
nekDiscordAjouterCommande("dé", "Lance un dé à 6 faces", fonction(interaction) {
  var resultat = nekAleatoire(1, 6);
  nekExecuterJS(`
    interaction.reply("🎲 Le dé a donné: " + ${resultat});
  `);
});
```

## 5. Publication de votre propre package

Vous pouvez créer et publier vos propres packages pour étendre les fonctionnalités de discordnek.

### Création d'un package

1. Créez un fichier .neko contenant vos fonctions
2. Exportez vos fonctions avec nekExporter()
3. Publiez votre package avec la commande suivante :

```bash
neko-script publier mon-package.neko --nom mon-package --version 1.0.0 --description "Description de mon package" --auteur "Votre Nom"
```

### Système de publication permanente

Grâce aux améliorations récentes, le système de publication des packages garantit :

1. **Disponibilité permanente** : Les packages sont stockés dans une base de données PostgreSQL et répliqués entre les serveurs.
2. **Fallback automatique** : Si PostgreSQL n'est pas disponible, le système utilise automatiquement un stockage local (~/.nekoscript/packages).
3. **Gestion des versions** : Versionning automatique et historique des versions pour chaque package.
4. **Métadonnées enrichies** : Support pour les auteurs, descriptions, mots-clés et dépendances.
5. **Facilité d'accès** : Les packages publiés sont immédiatement disponibles pour tous les utilisateurs via `nekImporter()`.

### Exemple de publication d'une extension à discordnek

```bash
# Publier une extension qui ajoute des commandes de modération
neko-script publier discord-moderation.neko --nom discord-moderation --version 1.0.0 --description "Commandes de modération pour les bots Discord" --auteur "Votre Nom"
```

Ensuite, dans votre code NekoScript :

```neko
// Importer discordnek et votre extension
nekImporter("discordnek");
nekImporter("discord-moderation");

// Initialiser le bot...
```

## Besoin d'aide ?

Pour plus d'informations sur l'utilisation de discordnek, utilisez la fonction d'aide intégrée :

```neko
// Afficher l'aide de discordnek
nekDiscordAide();
```

Ou consultez l'exemple complet dans `examples/discord-bot-example.neko`.