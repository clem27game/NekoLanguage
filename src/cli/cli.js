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
        await this.download(args[1]);
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
      case 'version':
        console.log('\x1b[36m🐱 NekoScript\x1b[0m version 1.0.0');
        break;
      default:
        console.error(`\x1b[31mCommande inconnue: ${command}\x1b[0m`);
        this.showHelp();
        break;
    }
  }

  async download(packageName) {
    if (!packageName) {
      console.error("\x1b[31mErreur: Veuillez spécifier un package à télécharger.\x1b[0m");
      console.log("Exemple: neko-script télécharger mathavancee");
      return;
    }

    console.log(`\x1b[36mTéléchargement du package \x1b[1m${packageName}\x1b[0m\x1b[36m...\x1b[0m`);
    
    try {
      const success = await this.packageManager.downloadPackage(packageName);
      if (success) {
        console.log(`\x1b[32m✓ Le package \x1b[1m${packageName}\x1b[0m\x1b[32m a été téléchargé avec succès !\x1b[0m`);
        console.log(`Vous pouvez maintenant l'importer dans vos scripts avec: nekImporter("${packageName}");`);
      } else {
        console.error(`\x1b[31m✗ Erreur lors du téléchargement du package \x1b[1m${packageName}\x1b[0m\x1b[31m.\x1b[0m`);
        console.log("Vérifiez que le nom du package est correct et que vous êtes connecté à Internet.");
      }
    } catch (error) {
      console.error(`\x1b[31m✗ Erreur: ${error.message}\x1b[0m`);
    }
  }

  async execute(filePath) {
    if (!filePath) {
      console.error("\x1b[31mErreur: Veuillez spécifier un fichier à exécuter.\x1b[0m");
      console.log("Exemple: neko-script exécuter hello.neko");
      return;
    }

    try {
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        console.error(`\x1b[31m✗ Erreur: Le fichier \x1b[1m${filePath}\x1b[0m\x1b[31m n'existe pas.\x1b[0m`);
        return;
      }

      // Check if file has .neko extension
      if (!filePath.endsWith('.neko')) {
        console.error(`\x1b[31m✗ Erreur: Le fichier \x1b[1m${filePath}\x1b[0m\x1b[31m n'est pas un fichier NekoScript (.neko).\x1b[0m`);
        return;
      }

      // Read file
      const code = fs.readFileSync(filePath, 'utf8');

      // Execute code
      console.log(`\x1b[36mExécution de \x1b[1m${filePath}\x1b[0m\x1b[36m...\x1b[0m`);
      
      // Capture start time for performance measurement
      const startTime = performance.now();
      
      // Execute the code
      const result = this.interpreter.interpret(code);
      
      // Calculate execution time
      const executionTime = ((performance.now() - startTime) / 1000).toFixed(2);
      
      console.log(`\x1b[32m✓ Exécution terminée ! \x1b[0m(\x1b[36m${executionTime}s\x1b[0m)`);
    } catch (error) {
      console.error(`\x1b[31m✗ Erreur lors de l'exécution: ${error.message}\x1b[0m`);
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
\x1b[1m\x1b[36m🐱 NekoScript - Langage de programmation en français\x1b[0m

\x1b[1mUsage:\x1b[0m neko-script [commande] [options]

\x1b[1mCommandes:\x1b[0m
  \x1b[33mexécuter\x1b[0m [fichier.neko]   Exécute un fichier NekoScript
  \x1b[33mtélécharger\x1b[0m [nom]         Télécharge un package depuis le dépôt
  \x1b[33mlibrairie\x1b[0m [nom]           Installe une bibliothèque
  \x1b[33mpublish\x1b[0m [package.neko]    Publie un package sur le dépôt
  \x1b[33mlister\x1b[0m                    Liste les packages disponibles
  \x1b[33maide\x1b[0m                      Affiche ce message d'aide

\x1b[1mExemples:\x1b[0m
  neko-script exécuter hello.neko
  neko-script télécharger mathavancee
  neko-script librairie neksite
  neko-script publish monpackage.neko
  
\x1b[1mSite web:\x1b[0m https://nekoscript.org
\x1b[1mDocumentation:\x1b[0m https://nekoscript.org/docs
\x1b[1mDépôt:\x1b[0m https://github.com/nekoscript/neko-script
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
