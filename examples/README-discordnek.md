# DiscordNek - Module NekoScript pour Discord Bots

Ce module permet de créer facilement des bots Discord en utilisant le langage NekoScript.

## Installation des dépendances

Avant d'utiliser DiscordNek, vous devez installer discord.js :

```bash
# Exécuter le script d'installation
neko-script exécuter installer-dependencies-discord.neko
```

## Publication du package

Pour publier le package `discordnek` et le rendre disponible pour tous les utilisateurs de NekoScript :

```bash
# Publier le package avec un nom, une version et une description
neko-script publier discordnek.neko --nom discordnek --version 1.0.0 --description "Module NekoScript pour créer des bots Discord" --auteur "Votre Nom"
```

## Utilisation du package

Une fois publié, n'importe quel utilisateur de NekoScript peut utiliser le package avec :

```neko
// Importer le module discordnek
nekImporter("discordnek");

// Initialiser et connecter le bot
nekDiscordInitialiser("VOTRE_TOKEN_DISCORD");
nekDiscordConnecter();

// Et utiliser toutes les fonctionnalités du module
```

## Fonctions disponibles

DiscordNek offre de nombreuses fonctions pour gérer votre bot Discord :

- `nekDiscordInitialiser(token)` - Initialise le bot avec votre token Discord
- `nekDiscordConnecter()` - Connecte le bot à Discord
- `nekDiscordDefinirStatus(status)` - Définit le statut du bot
- `nekDiscordDefinirActivite(type, texte)` - Définit l'activité du bot
- `nekDiscordAjouterCommande(nom, description, callback)` - Ajoute une commande slash
- `nekDiscordEnregistrerCommandes()` - Enregistre les commandes slash
- `nekDiscordConfigurerHandlerCommandes()` - Configure le gestionnaire de commandes
- `nekDiscordCreerEmbed(titre, description, couleur, champs, image)` - Crée un message embed
- `nekDiscordEnvoyerMessage(canalId, message)` - Envoie un message dans un canal
- `nekDiscordEnvoyerEmbed(canalId, embed)` - Envoie un embed dans un canal
- `nekDiscordEcouterEvenement(evenement, callback)` - Écoute un événement Discord
- `nekDiscordAide()` - Affiche un guide d'utilisation

## Création d'un Bot Discord

Pour créer un bot Discord, vous devez :

1. Créer une application sur [le portail développeur Discord](https://discord.com/developers/applications)
2. Ajouter un bot à votre application
3. Copier le token du bot
4. Utiliser ce token dans votre script NekoScript avec `nekDiscordInitialiser(token)`
5. Inviter le bot sur votre serveur avec une URL d'invitation

## Exemple d'URL d'invitation

```
https://discord.com/api/oauth2/authorize?client_id=VOTRE_APP_ID&permissions=8&scope=bot%20applications.commands
```

Remplacez `VOTRE_APP_ID` par l'ID de votre application Discord.

## Exemple complet

Voir le fichier `discord-bot-example.neko` pour un exemple complet d'utilisation.