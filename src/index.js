#!/usr/bin/env node

// Importer la nouvelle CLI avec gestion de packages partagés
const { NekoCLI } = require('./cli/cliNew');

// Détecter si on est en mode développement
const isDevMode = process.env.NODE_ENV === 'development';

// Main entry point for the NekoScript runtime
async function main() {
  try {
    // Initialiser la base de données des packages si nécessaire
    if (isDevMode) {
      // En mode développement, on peut initialiser la base de données
      console.log("Mode développement détecté, initialisation de la base de données des packages...");
      const { PackageDatabase } = require('./packageManager');
      await PackageDatabase.initialize();
    }
    
    // Initialize CLI
    const cli = new NekoCLI();
    
    // Run the CLI with command-line arguments
    await cli.run(process.argv.slice(2));
  } catch (error) {
    console.error("Erreur fatale:", error);
    process.exit(1);
  }
}

// Start the application
main();
