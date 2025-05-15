/**
 * Module NekoSite pour NekoScript
 * Permet la création simplifiée de sites web avec serveur localhost intégré
 */

const fs = require('fs');
const path = require('path');
const express = require('express');
// Utiliser une solution plus simple pour ouvrir le navigateur
const { exec } = require('child_process');

class NekoSite {
  constructor(runtime) {
    this.runtime = runtime;
    this.pages = [];
    this.assets = [];
    this.outputDir = './site-output';
    this.port = 5000; // Port unique pour le serveur localhost
    this.server = null;
  }

  /**
   * Crée un nouveau site web avec les pages spécifiées et démarre un serveur
   * @param {Object} config - Configuration du site web
   */
  créer(config) {
    // Créer le répertoire de sortie s'il n'existe pas
    this.ensureOutputDirectory();

    // Extraire les pages du config
    let sitePages = [];
    if (config.page) {
      // Si config.page est un objet unique (une seule page)
      sitePages.push(this.processPageConfig(config.page));
    } else if (config.pages && Array.isArray(config.pages)) {
      // Si config.pages est un tableau de pages
      sitePages = config.pages.map(page => this.processPageConfig(page));
    } else {
      // Fallback - chercher les pages dans le config
      for (const key in config) {
        if (typeof config[key] === 'object' && config[key].titre) {
          sitePages.push(this.processPageConfig(config[key], key));
        }
      }
    }

    // Créer les pages HTML
    for (const page of sitePages) {
      this.createPage(page);
    }

    // Si aucune page n'a été créée, créer une page d'accueil par défaut
    if (this.pages.length === 0) {
      this.createPage({
        title: "Accueil",
        content: "<h1>Site généré par NekoScript</h1><p>Ce site a été créé automatiquement.</p>",
        style: { backgroundColor: "#f5f5f5" }
      });
    }

    // Gérer les assets (images, etc.)
    for (const asset of this.assets) {
      this.copyAsset(asset);
    }

    console.log(`Site web créé avec succès dans le répertoire ${this.outputDir}`);
    console.log(`Pages créées: ${this.pages.map(page => page.title).join(', ')}`);

    // Démarrer le serveur local
    this.startServer();

    return { success: true, pageCount: this.pages.length, port: this.port };
  }

  /**
   * Traite la configuration d'une page pour la normaliser
   * @param {Object} pageConfig - Configuration brute de la page
   * @param {string} defaultTitle - Titre par défaut si non spécifié
   * @returns {Object} - Configuration normalisée
   */
  processPageConfig(pageConfig, defaultTitle = "Page") {
    const processedConfig = {
      title: pageConfig.titre || defaultTitle,
      content: pageConfig.contenu || "",
      style: pageConfig.style || {},
      links: [],
      images: []
    };

    // Chercher les liens
    if (pageConfig.lien) {
      if (Array.isArray(pageConfig.lien)) {
        for (const link of pageConfig.lien) {
          if (typeof link === 'string') {
            processedConfig.links.push({ text: link, url: this.slugify(link) + '.html' });
          } else if (Array.isArray(link) && link.length >= 2) {
            processedConfig.links.push({ text: link[0], url: link[1] });
          }
        }
      } else if (typeof pageConfig.lien === 'string') {
        processedConfig.links.push({ text: pageConfig.lien, url: this.slugify(pageConfig.lien) + '.html' });
      }
    }

    // Chercher les images
    if (pageConfig.image) {
      if (Array.isArray(pageConfig.image)) {
        processedConfig.images = pageConfig.image;
      } else {
        processedConfig.images.push(pageConfig.image);
      }
    }

    // Traiter le style
    if (pageConfig.style && typeof pageConfig.style === 'object') {
      // Convertir les propriétés du style
      for (const key in pageConfig.style) {
        const value = pageConfig.style[key];
        processedConfig.style[key] = value;
      }
    }

    return processedConfig;
  }

  /**
   * Crée une page HTML à partir d'une configuration
   * @param {Object} pageConfig - Configuration de la page
   */
  createPage(pageConfig) {
    const { title, content, style, links, images } = pageConfig;
    const filename = this.slugify(title) + '.html';
    const filepath = path.join(this.outputDir, filename);

    // Compiler le HTML
    const html = this.generateHTML(pageConfig);

    // Écrire le fichier
    try {
      fs.writeFileSync(filepath, html);
      console.log(`Page créée: ${filepath}`);
      this.pages.push({ title, path: filepath, filename });
    } catch (error) {
      console.error(`Erreur lors de la création de la page ${title}:`, error);
    }

    // Ajouter les images aux assets à copier
    if (images && Array.isArray(images)) {
      for (const image of images) {
        this.assets.push(image);
      }
    }
  }

  /**
   * Génère le HTML d'une page
   * @param {Object} pageConfig - Configuration de la page
   * @returns {string} - Code HTML généré
   */
  generateHTML(pageConfig) {
    const { title, content, style, links, script } = pageConfig;

    // Construire le CSS
    let cssStyles = '';
    if (style) {
      cssStyles = Object.entries(style).map(([key, value]) => {
        // Convertir camelCase en kebab-case pour le CSS
        const cssKey = key.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
        return `  ${cssKey}: ${value};`;
      }).join('\n');
    }

    // Construire les liens
    let linksHTML = '';
    if (links && Array.isArray(links)) {
      linksHTML = links.map(link => {
        return `<a href="${link.url}">${link.text}</a>`;
      }).join('\n  ');
    }

    // Ajouter les liens vers toutes les autres pages du site
    const otherPagesLinks = this.pages
      .filter(page => this.slugify(page.title) !== this.slugify(title)) // Exclure la page courante
      .map(page => `<a href="${page.filename}">${page.title}</a>`)
      .join('\n  ');
    
    if (otherPagesLinks) {
      if (linksHTML) linksHTML += '\n  ';
      linksHTML += otherPagesLinks;
    }

    // Construire le HTML
    return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
      line-height: 1.6;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f9f9f9;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    h1 {
      color: #333;
      margin-top: 0;
    }
    a {
      color: #0066cc;
      text-decoration: none;
      margin-right: 15px;
    }
    a:hover {
      text-decoration: underline;
    }
    .nav {
      margin: 20px 0;
    }
    img {
      max-width: 100%;
      height: auto;
      margin: 10px 0;
    }
    footer {
      margin-top: 20px;
      text-align: center;
      font-size: 0.8em;
      color: #666;
    }
${cssStyles}
  </style>
</head>
<body>
  <div class="container">
    <h1>${title}</h1>
    <div class="content">
      ${content}
    </div>
    
    <div class="nav">
      ${linksHTML}
    </div>
    
    <footer>
      Site généré par NekoScript - Un langage de programmation en français
    </footer>
  </div>
  
  <script>
    // Script NekoScript
    console.log('Site généré par NekoScript');
    ${script || ''}
  </script>
</body>
</html>`;
  }

  /**
   * Copie un asset dans le répertoire de sortie
   * @param {string} assetPath - Chemin de l'asset
   */
  copyAsset(assetPath) {
    try {
      const filename = path.basename(assetPath);
      const destination = path.join(this.outputDir, filename);
      
      if (fs.existsSync(assetPath)) {
        fs.copyFileSync(assetPath, destination);
        console.log(`Asset copié: ${destination}`);
      } else {
        console.warn(`Asset non trouvé: ${assetPath}`);
        
        // Créer un fichier d'image de remplacement si c'est une image
        if (filename.match(/\.(jpg|jpeg|png|gif|svg)$/i)) {
          this.createPlaceholderImage(destination);
        }
      }
    } catch (error) {
      console.error(`Erreur lors de la copie de l'asset ${assetPath}:`, error);
    }
  }

  /**
   * Crée une image SVG de remplacement
   * @param {string} destination - Chemin de destination
   */
  createPlaceholderImage(destination) {
    const svgContent = `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="#f0f0f0"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#999">Image NekoScript</text>
    </svg>`;
    
    try {
      fs.writeFileSync(destination.replace(/\.[^.]+$/, '.svg'), svgContent);
      console.log(`Image de remplacement créée: ${destination}`);
    } catch (error) {
      console.error(`Erreur lors de la création de l'image de remplacement:`, error);
    }
  }

  /**
   * Démarre un serveur Express pour servir le site
   */
  startServer() {
    if (this.server) {
      // Arrêter le serveur existant si nécessaire
      this.server.close();
    }

    const app = express();
    
    // Servir les fichiers statiques depuis le répertoire de sortie
    app.use(express.static(this.outputDir));
    
    // Redirection de la racine vers index.html
    app.get('/', (req, res) => {
      const indexPage = this.pages.find(page => 
        page.filename === 'index.html' || 
        page.filename === 'accueil.html' || 
        page.title.toLowerCase() === 'accueil'
      );
      
      if (indexPage) {
        res.redirect(`/${indexPage.filename}`);
      } else if (this.pages.length > 0) {
        res.redirect(`/${this.pages[0].filename}`);
      } else {
        res.send('Site NekoScript - Aucune page disponible');
      }
    });
    
    // Démarrer le serveur
    this.server = app.listen(this.port, '0.0.0.0', () => {
      console.log(`Serveur NekoScript démarré sur http://localhost:${this.port}`);
      
      // Ouvrir le navigateur selon la plateforme
      try {
        const url = `http://localhost:${this.port}`;
        let command;
        
        switch (process.platform) {
          case 'darwin': // macOS
            command = `open "${url}"`;
            break;
          case 'win32': // Windows
            command = `start "" "${url}"`;
            break;
          default: // Linux et autres
            command = `xdg-open "${url}"`;
            break;
        }
        
        exec(command, (error) => {
          if (error) {
            console.log(`Le navigateur n'a pas pu être ouvert automatiquement. Veuillez visiter: ${url}`);
          }
        });
      } catch (error) {
        console.log(`Le navigateur n'a pas pu être ouvert automatiquement. Accédez à http://localhost:${this.port} dans votre navigateur.`);
      }
    });
  }

  /**
   * S'assure que le répertoire de sortie existe
   */
  ensureOutputDirectory() {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Convertit un titre en slug pour l'URL
   * @param {string} text - Texte à convertir
   * @returns {string} - Slug généré
   */
  slugify(text) {
    if (!text) return 'index';
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      || 'index';
  }
}

module.exports = { NekoSite };