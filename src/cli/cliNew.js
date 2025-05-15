#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { NekoInterpreter } = require('../interpreter/nekoInterpreter');
const { PackageManager } = require('../packageManager');
const { PackageServer } = require('../packageManager');
const { PackageClient } = require('../packageManager');

class NekoCLI {
  constructor() {
    this.interpreter = new NekoInterpreter();
    this.packageManager = new PackageManager();
    
    // Créer une instance du client pour communiquer avec le serveur de packages
    this.packageClient = new PackageClient({
      development: process.env.NODE_ENV === 'development'
    });
    
    // Serveur de packages (démarré uniquement si nécessaire)
    this.packageServer = null;
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
        await this.publish(args[1], args.slice(2));
        break;
      case 'librairie':
        await this.installLibrary(args[1]);
        break;
      case 'lister':
        await this.listPackages();
        break;
      case 'rechercher':
        await this.searchPackages(args[1]);
        break;
      case 'serveur':
        await this.manageServer(args[1]);
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
      // Essayer d'abord avec le gestionnaire de packages global
      try {
        // Récupérer les informations sur le package
        const packageInfo = await this.packageClient.getPackageInfo(packageName);
        
        if (packageInfo) {
          console.log(`\x1b[36mPackage trouvé: \x1b[1m${packageName}\x1b[0m\x1b[36m version \x1b[1m${packageInfo.version}\x1b[0m\x1b[36m par \x1b[1m${packageInfo.author}\x1b[0m`);
          
          // Télécharger le contenu du package
          const packageContent = await this.packageClient.downloadPackage(packageName);
          
          // Enregistrer le package localement
          const success = await this.packageManager.publishPackage(packageName, packageContent, 'nekoScript', {
            version: packageInfo.version,
            author: packageInfo.author,
            description: packageInfo.description
          });
          
          if (success) {
            console.log(`\x1b[32m✓ Le package \x1b[1m${packageName}\x1b[0m\x1b[32m a été téléchargé et installé avec succès !\x1b[0m`);
            console.log(`Vous pouvez maintenant l'importer dans vos scripts avec: nekImporter("${packageName}");`);
            return;
          }
        }
      } catch (globalError) {
        // Échec du téléchargement depuis le serveur global, on continue avec le gestionnaire local
        console.log(`\x1b[33mImpossible de récupérer le package depuis le référentiel global: ${globalError.message}\x1b[0m`);
      }
      
      // Essayer avec le gestionnaire de packages local
      const success = await this.packageManager.downloadPackage(packageName);
      
      if (success) {
        console.log(`\x1b[32m✓ Le package \x1b[1m${packageName}\x1b[0m\x1b[32m a été téléchargé depuis le dépôt local avec succès !\x1b[0m`);
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

  async publish(packageName, options = []) {
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

      // Analyser les options supplémentaires
      let version = '1.0.0';
      let description = '';
      let author = 'Utilisateur NekoScript';
      
      for (let i = 0; i < options.length; i++) {
        if (options[i] === '--version' && i + 1 < options.length) {
          version = options[i + 1];
          i++;
        } else if (options[i] === '--description' && i + 1 < options.length) {
          description = options[i + 1];
          i++;
        } else if (options[i] === '--author' && i + 1 < options.length) {
          author = options[i + 1];
          i++;
        }
      }

      // Vérifier si le fichier existe
      if (!fs.existsSync(packageName)) {
        console.error(`\x1b[31m✗ Erreur: Le fichier ${packageName} n'existe pas.\x1b[0m`);
        return;
      }
      
      // Read file
      const packageContent = fs.readFileSync(packageName, 'utf8');

      // Extract name from filename (without extension)
      // Si le packageName fourni est déjà un nom et non un fichier, on l'utilise directement
      const name = packageName.endsWith('.neko') ? path.basename(packageName, '.neko') : packageName;
      
      console.log(`\x1b[36mPublication du package \x1b[1m${name}\x1b[0m\x1b[36m version \x1b[1m${version}\x1b[0m\x1b[36m...\x1b[0m`);

      // D'abord publier localement
      const localSuccess = await this.packageManager.publishPackage(name, packageContent, 'nekoScript', {
        version,
        author,
        description
      });

      if (!localSuccess) {
        console.error(`\x1b[31m✗ Erreur lors de la publication locale du package ${name}.\x1b[0m`);
        return;
      }
      
      // Ensuite essayer de publier globalement
      try {
        const response = await this.packageClient.publishPackage(name, packageContent, {
          language: 'nekoScript',
          version,
          author,
          description
        });
        
        if (response && (response.success || response.packageName)) {
          const updatedVersion = response.version || version;
          
          if (response.updated) {
            console.log(`\x1b[32m✓ Le package \x1b[1m${name}\x1b[0m\x1b[32m a été mis à jour avec succès en version \x1b[1m${updatedVersion}\x1b[0m\x1b[32m dans le référentiel global !\x1b[0m`);
          } else {
            console.log(`\x1b[32m✓ Le package \x1b[1m${name}\x1b[0m\x1b[32m a été publié avec succès en version \x1b[1m${updatedVersion}\x1b[0m\x1b[32m dans le référentiel global !\x1b[0m`);
          }
          
          console.log(`Il est maintenant disponible pour tous les utilisateurs de NekoScript.`);
          console.log(`Pour l'utiliser: \x1b[36mnekImporter("${name}");\x1b[0m`);
          
          // Si la version a été automatiquement incrémentée, informer l'utilisateur
          if (updatedVersion !== version) {
            console.log(`\x1b[33mNote: La version a été automatiquement incrémentée à ${updatedVersion} car la version ${version} existait déjà.\x1b[0m`);
          }
        } else {
          console.log(`\x1b[33mLe package a été sauvegardé localement mais n'a pas pu être publié dans le référentiel global.\x1b[0m`);
          console.log(`Vous pouvez quand même l'utiliser avec: \x1b[36mnekImporter("${name}");\x1b[0m`);
        }
      } catch (globalError) {
        console.log(`\x1b[33mLe package a été sauvegardé localement mais n'a pas pu être publié dans le référentiel global: ${globalError.message}\x1b[0m`);
        console.log(`Vous pouvez quand même l'utiliser avec: \x1b[36mnekImporter("${name}");\x1b[0m`);
        
        console.log(`\x1b[33mConseil: Pour mettre à jour un package existant, assurez-vous d'utiliser une version différente avec --version ou le serveur incrémentera automatiquement le numéro de version.\x1b[0m`);
      }
    } catch (error) {
      console.error(`\x1b[31m✗ Erreur lors de la publication: ${error.message}\x1b[0m`);
    }
  }

  async installLibrary(libraryName) {
    if (!libraryName) {
      console.error("Veuillez spécifier une bibliothèque à installer.");
      return;
    }

    // Rediriger vers la commande télécharger
    await this.download(libraryName);
  }

  async listPackages() {
    try {
      console.log("\x1b[36mPackages installés localement:\x1b[0m");
      const localPackages = await this.packageManager.getInstalledPackages();

      if (localPackages.length === 0) {
        console.log("  Aucun package installé localement.");
      } else {
        localPackages.forEach(packageName => {
          console.log(`  - ${packageName}`);
        });
      }
      
      // Essayer de récupérer la liste des packages globaux
      try {
        console.log("\n\x1b[36mPackages disponibles dans le référentiel global:\x1b[0m");
        const response = await this.packageClient.listPackages(10, 0, '');
        
        if (response && response.packages && response.packages.length > 0) {
          response.packages.forEach(pkg => {
            console.log(`  - ${pkg.name} (v${pkg.version}) par ${pkg.author}: ${pkg.description || 'Aucune description'}`);
          });
          
          if (response.count > 10) {
            console.log(`  ... et ${response.count - 10} autres packages. Utilisez 'rechercher' pour plus de résultats.`);
          }
        } else {
          console.log("  Aucun package disponible dans le référentiel global.");
        }
      } catch (globalError) {
        console.log(`\n\x1b[33mImpossible de récupérer les packages du référentiel global: ${globalError.message}\x1b[0m`);
      }
    } catch (error) {
      console.error(`\x1b[31m✗ Erreur lors de la récupération des packages: ${error.message}\x1b[0m`);
    }
  }

  async searchPackages(query) {
    if (!query) {
      console.log("Veuillez spécifier un terme de recherche.");
      console.log("Exemple: neko-script rechercher math");
      return;
    }
    
    try {
      console.log(`\x1b[36mRecherche de packages pour "\x1b[1m${query}\x1b[0m\x1b[36m"...\x1b[0m`);
      
      const response = await this.packageClient.listPackages(20, 0, query);
      
      if (response && response.packages && response.packages.length > 0) {
        console.log(`\x1b[32m✓ ${response.count} package(s) trouvé(s):\x1b[0m`);
        
        response.packages.forEach(pkg => {
          console.log(`\n\x1b[1m${pkg.name}\x1b[0m (v${pkg.version})`);
          console.log(`  Auteur: ${pkg.author}`);
          console.log(`  Description: ${pkg.description || 'Aucune description'}`);
          console.log(`  Téléchargements: ${pkg.downloads}`);
        });
        
        console.log(`\nUtilisez 'neko-script télécharger <nom>' pour installer l'un de ces packages.`);
      } else {
        console.log(`\x1b[33mAucun package ne correspond à votre recherche.\x1b[0m`);
      }
    } catch (error) {
      console.error(`\x1b[31m✗ Erreur lors de la recherche: ${error.message}\x1b[0m`);
    }
  }

  async manageServer(action) {
    if (!action) {
      console.log("Veuillez spécifier une action pour le serveur (démarrer, arrêter, état).");
      return;
    }

    switch (action) {
      case 'démarrer':
        if (!this.packageServer) {
          this.packageServer = new PackageServer();
          await this.packageServer.start();
          console.log(`\x1b[32m✓ Serveur de packages NekoScript démarré sur le port 5555\x1b[0m`);
        } else {
          console.log(`\x1b[33mLe serveur de packages est déjà en cours d'exécution.\x1b[0m`);
        }
        break;
        
      case 'arrêter':
        if (this.packageServer) {
          this.packageServer.stop();
          this.packageServer = null;
          console.log(`\x1b[32m✓ Serveur de packages NekoScript arrêté\x1b[0m`);
        } else {
          console.log(`\x1b[33mLe serveur de packages n'est pas en cours d'exécution.\x1b[0m`);
        }
        break;
        
      case 'état':
        if (this.packageServer) {
          console.log("Serveur de packages: \x1b[32mEn cours d'exécution\x1b[0m");
        } else {
          console.log("Serveur de packages: \x1b[31mArrêté\x1b[0m");
        }
        break;
        
      default:
        console.log(`\x1b[31mAction non reconnue: ${action}\x1b[0m`);
        console.log("Actions disponibles: démarrer, arrêter, état");
        break;
    }
  }

  showHelp() {
    console.log(`
\x1b[1m\x1b[36m🐱 NekoScript - Langage de programmation en français\x1b[0m

\x1b[1mUsage:\x1b[0m neko-script [commande] [options]

\x1b[1mCommandes:\x1b[0m
  \x1b[33mexécuter\x1b[0m [fichier.neko]      Exécute un fichier NekoScript
  \x1b[33mtélécharger\x1b[0m [nom]            Télécharge un package depuis le dépôt
  \x1b[33mlibrairie\x1b[0m [nom]              Installe une bibliothèque (alias de télécharger)
  \x1b[33mpublish\x1b[0m [package.neko]       Publie un package sur le dépôt
  \x1b[33mlister\x1b[0m                       Liste les packages disponibles
  \x1b[33mrechercher\x1b[0m [terme]           Recherche des packages dans le dépôt
  \x1b[33mserveur\x1b[0m [action]             Gère le serveur de packages (démarrer, arrêter, état)
  \x1b[33maide\x1b[0m                         Affiche ce message d'aide

\x1b[1mOptions pour publish:\x1b[0m
  --version [version]             Version du package (défaut: 1.0.0)
  --author [auteur]               Nom de l'auteur (défaut: Utilisateur NekoScript)
  --description [description]     Description du package

\x1b[1mExemples:\x1b[0m
  neko-script exécuter hello.neko
  neko-script télécharger mathavancee
  neko-script librairie neksite
  neko-script publish monpackage.neko --version 1.1.0 --author "Mon Nom"
  neko-script rechercher math
  
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