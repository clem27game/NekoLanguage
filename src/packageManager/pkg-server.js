/**
 * Serveur d'API pour le gestionnaire de packages NekoScript
 * Permet d'accéder aux packages depuis n'importe où
 */

const express = require('express');
const bodyParser = require('body-parser');
const packageDatabase = require('./pkg-schema');

class PackageServer {
  constructor(port = 5555) {
    this.port = port;
    this.app = express();
    this.configure();
  }

  /**
   * Configure le serveur Express
   */
  configure() {
    // Support pour les requêtes JSON
    this.app.use(bodyParser.json({ limit: '10mb' }));
    
    // Routes pour les packages
    this.setupRoutes();
  }

  /**
   * Définit les routes du serveur
   */
  setupRoutes() {
    // Route d'accueil
    this.app.get('/', (req, res) => {
      res.json({
        name: 'NekoScript Package Repository',
        version: '1.0.0',
        description: 'Référentiel de packages pour le langage NekoScript'
      });
    });

    // Liste tous les packages
    this.app.get('/api/packages', async (req, res) => {
      try {
        const { limit = 100, offset = 0, search = '' } = req.query;
        const packages = await packageDatabase.listPackages(
          parseInt(limit), 
          parseInt(offset), 
          search
        );
        
        res.json({
          success: true,
          count: packages.length,
          packages
        });
      } catch (error) {
        console.error('Erreur lors de la récupération des packages:', error);
        res.status(500).json({
          success: false,
          error: 'Erreur lors de la récupération des packages'
        });
      }
    });

    // Récupère les infos d'un package
    this.app.get('/api/packages/:name', async (req, res) => {
      try {
        const packageName = req.params.name;
        const packageInfo = await packageDatabase.getPackageInfo(packageName);
        
        if (!packageInfo) {
          return res.status(404).json({
            success: false,
            error: `Package ${packageName} non trouvé`
          });
        }
        
        res.json({
          success: true,
          package: packageInfo
        });
      } catch (error) {
        console.error(`Erreur lors de la récupération du package:`, error);
        res.status(500).json({
          success: false,
          error: 'Erreur lors de la récupération du package'
        });
      }
    });

    // Télécharge un package
    this.app.get('/api/packages/:name/download', async (req, res) => {
      try {
        const packageName = req.params.name;
        const { version } = req.query;
        
        const packageContent = await packageDatabase.downloadPackage(packageName, version);
        
        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Content-Disposition', `attachment; filename=${packageName}.neko`);
        res.send(packageContent);
      } catch (error) {
        console.error(`Erreur lors du téléchargement du package:`, error);
        res.status(500).json({
          success: false,
          error: 'Erreur lors du téléchargement du package'
        });
      }
    });

    // Publie un package
    this.app.post('/api/packages/:name', async (req, res) => {
      try {
        const packageName = req.params.name;
        const { content, language, version, author, description } = req.body;
        
        if (!content) {
          return res.status(400).json({
            success: false,
            error: 'Le contenu du package est requis'
          });
        }
        
        const result = await packageDatabase.publishPackage(
          packageName,
          content,
          language || 'nekoScript',
          { version, author, description }
        );
        
        res.json({
          success: true,
          message: `Package ${packageName} publié avec succès`,
          package: result
        });
      } catch (error) {
        console.error(`Erreur lors de la publication du package:`, error);
        res.status(500).json({
          success: false,
          error: 'Erreur lors de la publication du package'
        });
      }
    });
  }

  /**
   * Démarre le serveur
   */
  start() {
    return new Promise((resolve) => {
      this.server = this.app.listen(this.port, '0.0.0.0', () => {
        console.log(`Serveur de packages NekoScript démarré sur le port ${this.port}`);
        resolve();
      });
    });
  }

  /**
   * Arrête le serveur
   */
  stop() {
    if (this.server) {
      this.server.close();
      console.log('Serveur de packages NekoScript arrêté');
    }
  }
}

module.exports = PackageServer;

// Si ce fichier est exécuté directement, démarrer le serveur
if (require.main === module) {
  const server = new PackageServer();
  
  // Initialiser la base de données et démarrer le serveur
  packageDatabase.initialize()
    .then(() => server.start())
    .catch(err => {
      console.error('Erreur lors du démarrage du serveur:', err);
      process.exit(1);
    });
}