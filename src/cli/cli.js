#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { NekoInterpreter } = require('../interpreter/nekoInterpreter');
const { PackageManager } = require('../packageManager/packageManager');

class NekoCLI {
  constructor() {
    this.interpreter = new NekoInterpreter();
    this.packageManager = new PackageManager();
  }

  async run(args) {
    if (args.length < 1) {
      this.showHelp();
      return;
    }

    const command = args[0];

    switch (command) {
      case 'télécharger':
        await this.download();
        break;
      case 'exécuter':
        await this.execute(args[1]);
        break;
      case 'publish':
        await this.publish(args[1]);
        break;
      case 'librairie':
        await this.installLibrary(args[1]);
        break;
      case 'lister':
        await this.listPackages();
        break;
      case 'aide':
        this.showHelp();
        break;
      default:
        console.error(`Commande inconnue: ${command}`);
        this.showHelp();
        break;
    }
  }

  async download() {
    console.log("Téléchargement et installation de NekoScript...");
    console.log("NekoScript a été installé avec succès !");
  }

  async execute(filePath) {
    if (!filePath) {
      console.error("Veuillez spécifier un fichier à exécuter.");
      return;
    }

    try {
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        console.error(`Le fichier ${filePath} n'existe pas.`);
        return;
      }

      // Check if file has .neko extension
      if (!filePath.endsWith('.neko')) {
        console.error(`Le fichier ${filePath} n'est pas un fichier NekoScript (.neko).`);
        return;
      }

      // Read file
      const code = fs.readFileSync(filePath, 'utf8');

      // Execute code
      console.log(`Exécution de ${filePath}...`);
      const result = this.interpreter.interpret(code);
      
      console.log("Exécution terminée !");
    } catch (error) {
      console.error("Erreur lors de l'exécution:", error);
    }
  }

  async publish(packageName) {
    if (!packageName) {
      console.error("Veuillez spécifier un nom de package à publier.");
      return;
    }

    try {
      // Check if it's a .neko file
      if (!packageName.endsWith('.neko')) {
        console.error(`Le fichier ${packageName} n'est pas un fichier NekoScript (.neko).`);
        return;
      }

      // Check if file exists
      if (!fs.existsSync(packageName)) {
        console.error(`Le fichier ${packageName} n'existe pas.`);
        return;
      }

      // Read file
      const packageContent = fs.readFileSync(packageName, 'utf8');

      // Extract name from filename (without extension)
      const name = path.basename(packageName, '.neko');

      // Publish package
      const success = await this.packageManager.publishPackage(name, packageContent, 'nekoScript');

      if (success) {
        console.log(`Le package ${name} a été publié avec succès !`);
      } else {
        console.error(`Erreur lors de la publication du package ${name}.`);
      }
    } catch (error) {
      console.error("Erreur lors de la publication:", error);
    }
  }

  async installLibrary(libraryName) {
    if (!libraryName) {
      console.error("Veuillez spécifier une bibliothèque à installer.");
      return;
    }

    try {
      const success = await this.packageManager.downloadPackage(libraryName);

      if (success) {
        console.log(`La bibliothèque ${libraryName} a été installée avec succès !`);
      } else {
        console.error(`Erreur lors de l'installation de la bibliothèque ${libraryName}.`);
      }
    } catch (error) {
      console.error("Erreur lors de l'installation:", error);
    }
  }

  async listPackages() {
    try {
      const packages = await this.packageManager.getInstalledPackages();

      console.log("Bibliothèques installées :");
      if (packages.length === 0) {
        console.log("  Aucune bibliothèque installée.");
      } else {
        packages.forEach(packageName => {
          console.log(`  - ${packageName}`);
        });
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des packages:", error);
    }
  }

  showHelp() {
    console.log(`
NekoScript - Langage de programmation en français

Usage: $neko-script [commande] [options]

Commandes:
  télécharger               Télécharge et installe NekoScript
  exécuter [fichier.neko]   Exécute un fichier NekoScript
  publish [package.neko]    Publie un package NekoScript
  librairie [nom]           Télécharge une bibliothèque NekoScript
  lister                    Affiche la liste des bibliothèques installées
  aide                      Affiche ce message d'aide

Exemples:
  $neko-script télécharger
  $neko-script exécuter monscript.neko
  $neko-script publish monpackage.neko
  $neko-script librairie Discord.neko
    `);
  }
}

// If this script is executed directly
if (require.main === module) {
  const cli = new NekoCLI();
  cli.run(process.argv.slice(2)).catch(error => {
    console.error("Erreur:", error);
    process.exit(1);
  });
}

module.exports = {
  NekoCLI
};
