/**
 * Serveur de site web NekoScript
 * Ce script démarre un serveur Express qui sert les fichiers statiques
 * générés par les exemples de site NekoScript
 */

const express = require('express');
const path = require('path');
const fs = require('fs');

// Création de l'application Express
const app = express();
const PORT = 5000;

// Répertoire où se trouvent les fichiers générés
const siteOutputDir = path.join(__dirname, 'site-output');

// Vérification de l'existence du répertoire de sortie
if (!fs.existsSync(siteOutputDir)) {
  fs.mkdirSync(siteOutputDir, { recursive: true });
  
  // Création d'une page par défaut si le répertoire est vide
  const defaultPage = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>NekoScript - Site par défaut</title>
      <style>
        body {
          font-family: 'Segoe UI', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        h1 {
          color: #3498db;
          border-bottom: 2px solid #3498db;
          padding-bottom: 10px;
        }
        .info-box {
          background-color: #f8f9fa;
          border-left: 4px solid #3498db;
          padding: 15px;
          margin: 20px 0;
        }
        code {
          background-color: #f1f1f1;
          padding: 2px 4px;
          border-radius: 4px;
          font-family: monospace;
        }
      </style>
    </head>
    <body>
      <h1>NekoScript - Générateur de sites web</h1>
      
      <div class="info-box">
        <p>
          Ce serveur est prêt à afficher votre site NekoScript.
          Pour générer un site, exécutez un script NekoScript qui crée des fichiers HTML dans le dossier 'site-output'.
        </p>
      </div>
      
      <h2>Comment créer un site avec NekoScript</h2>
      <p>Voici un exemple de script NekoScript pour créer un site web :</p>
      <pre><code>
// Importer le module neksite
nekImporter("neksite");

// Configurer votre site
neksite.créer {
  titre: "Mon Site NekoScript";
  description: "Un site créé avec NekoScript";
  
  // Pages du site
  pages: [
    {
      titre: "Accueil",
      contenu: "Bienvenue sur mon site !",
      filename: "index.html"
    }
  ]
}
      </code></pre>
      
      <p>Exécutez ce script avec la commande :</p>
      <pre><code>node src/index.js exécuter examples/mon-site.neko</code></pre>
    </body>
    </html>
  `;
  
  fs.writeFileSync(path.join(siteOutputDir, 'index.html'), defaultPage);
  console.log('Page par défaut créée dans ' + siteOutputDir);
}

// Configuration des routes
app.use(express.static(siteOutputDir));

// Route par défaut
app.get('/', (req, res) => {
  const indexPath = path.join(siteOutputDir, 'index.html');
  
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.send('Aucun fichier index.html trouvé dans ' + siteOutputDir);
  }
});

// Démarrage du serveur
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Serveur de site NekoScript démarré sur http://localhost:${PORT}`);
  console.log(`Servir les fichiers depuis: ${siteOutputDir}`);
});