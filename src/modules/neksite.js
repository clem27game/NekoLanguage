/**
 * Module NekoSite pour NekoScript
 * Permet la création simplifiée de sites web avec serveur localhost intégré
 * Entièrement personnalisable par l'utilisateur
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
    
    // Thèmes prédéfinis que l'utilisateur peut modifier
    this.themes = {
      clair: {
        couleurFond: "#f9f9f9",
        couleurTexte: "#333333",
        couleurTitre: "#222222",
        couleurLien: "#0066cc",
        police: "Arial, sans-serif",
        bordureRayon: "8px",
        bordureCouleur: "#eaeaea"
      },
      sombre: {
        couleurFond: "#222222",
        couleurTexte: "#f0f0f0",
        couleurTitre: "#ffffff",
        couleurLien: "#5599ff",
        police: "Arial, sans-serif",
        bordureRayon: "8px",
        bordureCouleur: "#444444"
      },
      coloré: {
        couleurFond: "#fcf4e8",
        couleurTexte: "#4e3620",
        couleurTitre: "#c27c3d",
        couleurLien: "#d95525",
        police: "Georgia, serif",
        bordureRayon: "12px",
        bordureCouleur: "#e6c9a8"
      }
    };
  }

  /**
   * Crée un nouveau site web avec les pages spécifiées et démarre un serveur
   * @param {Object} config - Configuration du site web fournie par l'utilisateur
   */
  créer(config) {
    // Créer le répertoire de sortie s'il n'existe pas
    this.ensureOutputDirectory();
    
    // Configuration globale du site
    this.siteConfig = {
      titre: config.titre || "Site NekoScript",
      description: config.description || "Site créé avec NekoScript",
      auteur: config.auteur || "Utilisateur NekoScript",
      langue: config.langue || "fr",
      theme: config.theme ? (this.themes[config.theme] || this.themes.clair) : this.themes.clair,
      favicon: config.favicon || null,
      stylePersonnalisé: config.stylePersonnalisé || "",
      scriptPersonnalisé: config.scriptPersonnalisé || "",
      avecNav: config.avecNav !== undefined ? config.avecNav : true,
      avecFooter: config.avecFooter !== undefined ? config.avecFooter : true,
      footerTexte: config.footerTexte || "Site généré avec NekoScript",
      ...config // Inclure toutes les autres propriétés personnalisées
    };

    // Extraire les pages du config
    let sitePages = [];
    
    // Traiter les pages selon la structure fournie par l'utilisateur
    if (config.page) {
      // Si config.page est un objet unique (une seule page)
      sitePages.push(this.processPageConfig(config.page));
    } else if (config.pages && Array.isArray(config.pages)) {
      // Si config.pages est un tableau de pages
      sitePages = config.pages.map(page => this.processPageConfig(page));
    } else {
      // Chercher toutes les déclarations de page dans le config
      for (const key in config) {
        const value = config[key];
        // Une page est un objet qui contient au moins titre ou contenu
        if (typeof value === 'object' && (value.titre || value.contenu)) {
          const pageName = key.startsWith('page') ? key.replace('page', '').trim() : key;
          sitePages.push(this.processPageConfig(value, pageName));
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
        content: "<h1>Site généré par NekoScript</h1><p>Ce site a été créé automatiquement. Aucune page n'a été spécifiée dans la configuration.</p>",
        style: {}
      });
    }

    // Gérer les assets (images, etc.)
    if (config.assets && Array.isArray(config.assets)) {
      for (const asset of config.assets) {
        this.assets.push(asset);
      }
    }
    
    // Gérer les images mentionnées dans les pages
    for (const asset of this.assets) {
      this.copyAsset(asset);
    }

    console.log(`Site web créé avec succès dans le répertoire ${this.outputDir}`);
    console.log(`Pages créées: ${this.pages.map(page => page.title).join(', ')}`);

    // Démarrer le serveur local
    this.startServer();

    return { 
      success: true, 
      pageCount: this.pages.length, 
      port: this.port,
      outputDir: this.outputDir
    };
  }

  /**
   * Traite la configuration d'une page pour la normaliser
   * @param {Object} pageConfig - Configuration brute de la page
   * @param {string} defaultTitle - Titre par défaut si non spécifié
   * @returns {Object} - Configuration normalisée
   */
  processPageConfig(pageConfig, defaultTitle = "Page") {
    // Si pageConfig est une chaîne de caractères, on la considère comme le titre
    if (typeof pageConfig === 'string') {
      pageConfig = { titre: pageConfig };
    }
    
    // Extraire le titre soit de la propriété "titre", soit du nom par défaut
    let pageTitle = pageConfig.titre || defaultTitle;
    
    // Si le nom par défaut est numérique (page1, page2...), utiliser "Page X"
    if (defaultTitle.match(/^\d+$/)) {
      pageTitle = pageConfig.titre || `Page ${defaultTitle}`;
    }

    // Créer une configuration normalisée avec toutes les propriétés possibles
    const processedConfig = {
      title: pageTitle,
      content: pageConfig.contenu || pageConfig.content || "",
      style: pageConfig.style || {},
      links: [],
      images: [],
      scripts: pageConfig.scripts || pageConfig.script || "",
      meta: pageConfig.meta || {},
      filename: pageConfig.filename || this.slugify(pageTitle) + '.html',
      navigation: pageConfig.navigation !== undefined ? pageConfig.navigation : true,
      template: pageConfig.template || "standard",
      rawHtml: pageConfig.rawHtml || null,
      // Autres propriétés personnalisées conservées pour l'utilisateur
      ...pageConfig
    };

    // Traiter les liens
    if (pageConfig.lien) {
      this.processLinks(pageConfig.lien, processedConfig);
    }
    
    if (pageConfig.liens) {
      this.processLinks(pageConfig.liens, processedConfig);
    }

    // Traiter les images
    if (pageConfig.image) {
      this.processImages(pageConfig.image, processedConfig);
    }
    
    if (pageConfig.images) {
      this.processImages(pageConfig.images, processedConfig);
    }

    // Traiter le style CSS
    if (pageConfig.style && typeof pageConfig.style === 'object') {
      // Conserver toutes les propriétés de style
      processedConfig.style = { ...pageConfig.style };
    }
    
    // Permettre d'utiliser une feuille de style CSS personnalisée
    if (pageConfig.styleCSS) {
      processedConfig.styleCSS = pageConfig.styleCSS;
    }

    return processedConfig;
  }
  
  /**
   * Traite les liens d'une page
   */
  processLinks(linkData, processedConfig) {
    if (Array.isArray(linkData)) {
      for (const link of linkData) {
        if (typeof link === 'string') {
          processedConfig.links.push({ 
            text: link, 
            url: this.slugify(link) + '.html' 
          });
        } else if (Array.isArray(link) && link.length >= 2) {
          processedConfig.links.push({ 
            text: link[0], 
            url: link[1] 
          });
        } else if (typeof link === 'object' && link.texte) {
          processedConfig.links.push({ 
            text: link.texte || link.text, 
            url: link.url || this.slugify(link.texte || link.text) + '.html',
            target: link.target || '_self',
            class: link.class || '',
            id: link.id || ''
          });
        }
      }
    } else if (typeof linkData === 'string') {
      processedConfig.links.push({ 
        text: linkData, 
        url: this.slugify(linkData) + '.html' 
      });
    } else if (typeof linkData === 'object' && linkData.texte) {
      processedConfig.links.push({ 
        text: linkData.texte || linkData.text, 
        url: linkData.url || this.slugify(linkData.texte || linkData.text) + '.html',
        target: linkData.target || '_self',
        class: linkData.class || '',
        id: linkData.id || ''
      });
    }
  }
  
  /**
   * Traite les images d'une page
   */
  processImages(imageData, processedConfig) {
    if (Array.isArray(imageData)) {
      for (const image of imageData) {
        if (typeof image === 'string') {
          processedConfig.images.push(image);
          this.assets.push(image);
        } else if (typeof image === 'object' && image.src) {
          processedConfig.images.push(image.src);
          this.assets.push(image.src);
        }
      }
    } else if (typeof imageData === 'string') {
      processedConfig.images.push(imageData);
      this.assets.push(imageData);
    } else if (typeof imageData === 'object' && imageData.src) {
      processedConfig.images.push(imageData.src);
      this.assets.push(imageData.src);
    }
  }

  /**
   * Crée une page HTML à partir d'une configuration
   * @param {Object} pageConfig - Configuration de la page
   */
  createPage(pageConfig) {
    // Utiliser le nom de fichier spécifié ou en créer un à partir du titre
    const filename = pageConfig.filename || this.slugify(pageConfig.title) + '.html';
    const filepath = path.join(this.outputDir, filename);
    
    // Si l'utilisateur a fourni du HTML brut, l'utiliser tel quel
    if (pageConfig.rawHtml) {
      try {
        fs.writeFileSync(filepath, pageConfig.rawHtml);
        console.log(`Page créée (HTML brut): ${filepath}`);
        this.pages.push({ 
          title: pageConfig.title, 
          path: filepath, 
          filename: filename 
        });
        return;
      } catch (error) {
        console.error(`Erreur lors de la création de la page ${pageConfig.title} (HTML brut):`, error);
      }
    }

    // Sinon, compiler le HTML à partir de la config
    const html = this.generateHTML(pageConfig);

    // Écrire le fichier
    try {
      fs.writeFileSync(filepath, html);
      console.log(`Page créée: ${filepath}`);
      this.pages.push({ 
        title: pageConfig.title, 
        path: filepath, 
        filename: filename 
      });
    } catch (error) {
      console.error(`Erreur lors de la création de la page ${pageConfig.title}:`, error);
    }
  }

  /**
   * Génère le HTML d'une page en fonction de la configuration utilisateur
   * @param {Object} pageConfig - Configuration de la page
   * @returns {string} - Code HTML généré
   */
  generateHTML(pageConfig) {
    const { title, content, style, links, scripts } = pageConfig;
    
    // Fusionner les styles de la page avec le thème global
    const mergedStyle = { ...this.siteConfig.theme, ...style };

    // Construire le CSS
    let cssStyles = '';
    if (mergedStyle) {
      cssStyles = Object.entries(mergedStyle).map(([key, value]) => {
        // Convertir camelCase en kebab-case pour le CSS
        const cssKey = key.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
        return `  ${cssKey}: ${value};`;
      }).join('\n');
    }
    
    // Ajouter les styles CSS personnalisés de la page
    if (pageConfig.styleCSS) {
      cssStyles += '\n' + pageConfig.styleCSS;
    }
    
    // Ajouter les styles CSS globaux personnalisés
    if (this.siteConfig.stylePersonnalisé) {
      cssStyles += '\n' + this.siteConfig.stylePersonnalisé;
    }

    // Construire les liens de navigation
    let linksHTML = '';
    if (this.siteConfig.avecNav && links && Array.isArray(links)) {
      linksHTML = links.map(link => {
        const target = link.target ? ` target="${link.target}"` : '';
        const cls = link.class ? ` class="${link.class}"` : '';
        const id = link.id ? ` id="${link.id}"` : '';
        return `<a href="${link.url}"${target}${cls}${id}>${link.text}</a>`;
      }).join('\n  ');
    }

    // Ajouter les liens vers les autres pages seulement si navigation activée
    if (this.siteConfig.avecNav && pageConfig.navigation) {
      const otherPagesLinks = this.pages
        .filter(page => page.filename !== (pageConfig.filename || this.slugify(title) + '.html'))
        .map(page => `<a href="${page.filename}">${page.title}</a>`)
        .join('\n  ');
      
      if (otherPagesLinks) {
        if (linksHTML) linksHTML += '\n  ';
        linksHTML += otherPagesLinks;
      }
    }
    
    // Construire les métadonnées
    let metaTags = '';
    if (pageConfig.meta) {
      for (const [name, content] of Object.entries(pageConfig.meta)) {
        metaTags += `  <meta name="${name}" content="${content}">\n`;
      }
    }
    
    // Ajouter les métadonnées globales du site
    metaTags += `  <meta name="description" content="${this.siteConfig.description}">\n`;
    metaTags += `  <meta name="author" content="${this.siteConfig.auteur}">\n`;
    
    // Générer le footer si activé
    let footerHTML = '';
    if (this.siteConfig.avecFooter) {
      footerHTML = `
    <footer>
      ${this.siteConfig.footerTexte}
    </footer>`;
    }
    
    // Scripts personnalisés
    let scriptContent = 'console.log("Site généré par NekoScript");';
    if (scripts) {
      scriptContent += '\n    ' + scripts;
    }
    if (this.siteConfig.scriptPersonnalisé) {
      scriptContent += '\n    ' + this.siteConfig.scriptPersonnalisé;
    }

    // Construire le HTML final
    return `<!DOCTYPE html>
<html lang="${this.siteConfig.langue}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
${metaTags}
  <title>${title} - ${this.siteConfig.titre}</title>
  <style>
    body {
      font-family: ${mergedStyle.police || "Arial, sans-serif"};
      margin: 0;
      padding: 20px;
      line-height: 1.6;
      background-color: ${mergedStyle.couleurFond || "#f9f9f9"};
      color: ${mergedStyle.couleurTexte || "#333333"};
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background-color: ${mergedStyle.couleurContenuFond || "#ffffff"};
      border-radius: ${mergedStyle.bordureRayon || "8px"};
      box-shadow: 0 2px 4px ${mergedStyle.bordureCouleur || "rgba(0,0,0,0.1)"};
    }
    h1, h2, h3, h4, h5, h6 {
      color: ${mergedStyle.couleurTitre || "#222222"};
      margin-top: 0;
    }
    a {
      color: ${mergedStyle.couleurLien || "#0066cc"};
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
      color: ${mergedStyle.couleurFooter || "#666666"};
    }
${cssStyles}
  </style>
${this.siteConfig.favicon ? `  <link rel="icon" href="${this.siteConfig.favicon}">` : ''}
</head>
<body>
  <div class="container">
    <h1>${title}</h1>
    <div class="content">
      ${content}
    </div>
    ${this.siteConfig.avecNav && linksHTML ? `
    <div class="nav">
      ${linksHTML}
    </div>` : ''}
${footerHTML}
  </div>
  
  <script>
    ${scriptContent}
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