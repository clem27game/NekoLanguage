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
// Importer notre helper pour la gestion des variables
const { NekoSiteHelper } = require('../interpreter/nekoSiteHelper');

// Rediriger les avertissements de variables non définies vers une fonction silencieuse
// Cela évite d'afficher les faux positifs lors du parsing HTML
const originalConsoleWarn = console.warn;
console.warn = function(...args) {
  // Filtrer les messages concernant les variables non définies dans le HTML
  const message = args[0];
  if (typeof message === 'string' && message.startsWith('Variable "') && message.includes('non définie')) {
    const variableName = message.split('"')[1];
    // Liste de mots clés HTML, CSS et JS couramment utilisés qui génèrent des faux positifs
    const htmlJsKeywords = [
      // HTML éléments
      'div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'img', 'form', 'input',
      'button', 'table', 'tr', 'td', 'th', 'thead', 'tbody', 'header', 'footer', 'nav', 'section', 'article',
      'aside', 'main', 'figure', 'figcaption', 'blockquote', 'code', 'pre', 'strong', 'em', 'b', 'i', 'u',
      'label', 'select', 'option', 'textarea', 'iframe', 'canvas', 'audio', 'video', 'source', 'track',
      
      // HTML attributs
      'src', 'href', 'class', 'id', 'style', 'alt', 'title', 'width', 'height', 'type', 'name', 'value',
      'placeholder', 'autocomplete', 'required', 'disabled', 'readonly', 'checked', 'selected', 'target',
      'rel', 'aria-label', 'data-', 'role', 'tabindex', 'colspan', 'rowspan',
      
      // CSS propriétés
      'color', 'background', 'margin', 'padding', 'border', 'font', 'text', 'display', 'position', 'top',
      'left', 'right', 'bottom', 'width', 'height', 'max-width', 'min-width', 'float', 'clear', 'opacity',
      'z-index', 'box-shadow', 'text-shadow', 'transform', 'transition', 'animation', 'flex', 'grid',
      'align', 'justify', 'content', 'items', 'self', 'center', 'space-between', 'space-around', 'stretch',
      'start', 'end', 'baseline', 'wrap', 'block', 'inline', 'relative', 'absolute', 'fixed', 'sticky',
      'none', 'auto', 'hidden', 'solid', 'dotted', 'dashed', 'bold', 'italic', 'underline', 'uppercase',
      'lowercase', 'capitalize', 'nowrap', 'pre', 'pre-wrap', 'pre-line', 'break', 'pointer', 'default',
      
      // JavaScript mots-clés
      'true', 'false', 'null', 'undefined', 'document', 'window', 'console', 'function', 'var', 'let',
      'const', 'if', 'else', 'switch', 'case', 'for', 'while', 'do', 'break', 'continue', 'return',
      'new', 'this', 'try', 'catch', 'finally', 'throw', 'async', 'await', 'Promise', 'fetch', 'map',
      'filter', 'reduce', 'forEach', 'push', 'pop', 'shift', 'unshift', 'join', 'split', 'slice',
      'substring', 'replace', 'match', 'test', 'indexOf', 'lastIndexOf', 'includes', 'toLowerCase',
      'toUpperCase', 'length', 'find', 'some', 'every', 'sort', 'keys', 'values', 'entries',
      
      // JavaScript DOM/BOM
      'addEventListener', 'getElementById', 'getElementsByClassName', 'getElementsByTagName',
      'querySelector', 'querySelectorAll', 'innerHTML', 'outerHTML', 'textContent', 'appendChild',
      'removeChild', 'insertBefore', 'createElement', 'createTextNode', 'setAttribute', 'getAttribute',
      'removeAttribute', 'classList', 'add', 'remove', 'toggle', 'contains', 'dataset', 'style',
      'parentNode', 'childNodes', 'firstChild', 'lastChild', 'nextSibling', 'previousSibling',
      'className', 'location', 'history', 'navigator', 'setTimeout', 'setInterval', 'clearTimeout',
      'clearInterval', 'localStorage', 'sessionStorage', 'preventDefault', 'stopPropagation',
      
      // Français (mots courants dans le HTML)
      'accueil', 'contact', 'propos', 'nous', 'vous', 'menu', 'sur', 'voir', 'plus', 'moins', 'tous',
      'savoir', 'retour', 'cta', 'feature', 'header', 'content', 'footer'
    ];
      
    // Si le nom de la variable est un mot clé HTML/JS, ne pas afficher l'avertissement
    if (htmlJsKeywords.includes(variableName) || 
        variableName.length <= 2 || // Ignorer les variables de 1-2 caractères (souvent des noms génériques dans le HTML)
        /^[A-Z][a-z]+[A-Z]/.test(variableName)) { // Ignorer les mots en camelCase comme DOMContentLoaded
      return; // Ignorer ce message
    }
  }
  
  // Sinon, utiliser l'implémentation originale
  originalConsoleWarn.apply(console, args);
};

class NekoSite {
  constructor(runtime) {
    this.runtime = runtime;
    this.pages = [];
    this.assets = [];
    this.outputDir = './site-output';
    this.port = 5000; // Port unique pour le serveur localhost
    this.server = null;
    
    // Initialiser notre helper de gestion des variables
    this.siteHelper = new NekoSiteHelper(runtime);
    
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
    // Stocker la configuration originale pour référence
    this.originalConfig = JSON.parse(JSON.stringify(config));
    
    // Créer le répertoire de sortie s'il n'existe pas
    this.ensureOutputDirectory();
    
    // Remplacer les variables par leurs valeurs dans la configuration entière
    config = this.processVariables(config);
    
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
    
    // Vérifier d'abord si nous avons une structure "page" spéciale dans config
    // Cette structure est un Array ou un objet spécial dans le runtime NekoScript
    if (config.page && Array.isArray(config.page)) {
      // Si c'est un tableau, traiter chaque élément comme une page
      for (const pageEntry of config.page) {
        if (typeof pageEntry === 'object' && pageEntry !== null) {
          // Le premier élément (index 0) est généralement le nom/titre de la page
          const pageTitle = pageEntry[0] || "Page";
          const pageData = pageEntry[1] || {};
          
          // Créer un objet de configuration de page complet
          const pageConfig = {
            titre: pageTitle,
            ...pageData
          };
          
          sitePages.push(this.processPageConfig(pageConfig));
        }
      }
    } else if (config.page && typeof config.page === 'object') {
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
    
    // Log pour debugger la structure des pages détectées
    console.log(`Site web avec ${sitePages.length} pages.`);

    // Créer les pages HTML
    for (const page of sitePages) {
      this.createPage(page);
    }

    // Si aucune page n'a été créée, créer une page d'accueil par défaut
    if (this.pages.length === 0 && sitePages.length === 0) {
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
    // Attention à ne pas écraser les propriétés d'origine
    const processedConfig = {
      // Propriétés de base normalisées
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
      rawHtml: pageConfig.rawHtml || null
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
    // Assurer que style est bien un objet pour éviter les erreurs
    const pageStyle = typeof style === 'object' && style !== null ? style : {};
    const mergedStyle = { ...this.siteConfig.theme, ...pageStyle };
    
    // Conserver le contenu original avec variables (le remplacement se fera côté client)
    // Stocker les variables pour les afficher plus tard
    let processedContent = content;
    
    // Vérifier que le contenu est bien une chaîne de caractères
    if (typeof processedContent !== 'string') {
      processedContent = String(processedContent || '');
    }

    // Construire le CSS
    let cssStyles = '';
    if (mergedStyle) {
      cssStyles = Object.entries(mergedStyle).map(([key, value]) => {
        // Convertir camelCase en kebab-case pour le CSS
        const cssKey = key.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
        
        // Extraire et transformer les propriétés CSS
        // Pour les propriétés spécifiques au modèle, ne pas les inclure dans le CSS brut
        if (key.startsWith('couleur') || key.startsWith('police') || 
            key.startsWith('bordure') || key.startsWith('taille') || 
            key.startsWith('marge') || key.startsWith('padding')) {
          // Ces propriétés sont déjà appliquées dans le template CSS principal
          return ``;
        }
        
        return `  ${cssKey}: ${value};`;
      }).filter(line => line.trim() !== '').join('\n');
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
    
    // Middleware pour parser le body des requêtes
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    
    // Servir les fichiers statiques depuis le répertoire de sortie
    app.use(express.static(this.outputDir));
    
    // Intercepter toutes les requêtes pour les pages pour remplacer les variables dynamiques
    const that = this; // Référence à l'instance NekoSite
    
    app.use((req, res, next) => {
      // Stocker la méthode send originale pour l'intercepter
      const originalSend = res.send;
      
      // Remplacer la méthode send pour traiter le contenu avant envoi
      res.send = function(body) {
        // Ne traiter que les réponses HTML
        if (typeof body === 'string' && body.includes('<!DOCTYPE html>')) {
          try {
            // Utiliser notre helper pour remplacer les variables
            const processedBody = that.siteHelper.replaceVariables(body);
            
            // Appeler la méthode send originale avec le contenu traité
            return originalSend.call(this, processedBody);
          } catch (error) {
            console.error('Erreur lors du traitement des variables dans la page:', error);
          }
        }
        
        // Si ce n'est pas du HTML ou en cas d'erreur, envoyer le contenu original
        return originalSend.call(this, body);
      };
      
      next();
    });
    
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
    
    // API pour accéder aux variables du runtime (utilisation interne seulement)
    app.get('/api/variables', (req, res) => {
      try {
        // Récupérer toutes les variables disponibles
        const variables = {};
        // Note: dépend de l'implémentation du runtime, à adapter si nécessaire
        if (this.runtime && this.runtime.scope) {
          Object.keys(this.runtime.scope).forEach(key => {
            try {
              const value = this.runtime.getVariable(key);
              variables[key] = value;
            } catch (e) {
              // Ignorer les variables qu'on ne peut pas récupérer
            }
          });
        }
        res.json(variables);
      } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des variables' });
      }
    });
    
    // Endpoint pour afficher les variables disponibles dans une page HTML
    app.get('/debug-variables', (req, res) => {
      try {
        // Récupérer toutes les variables disponibles
        const variables = {};
        if (this.runtime && this.runtime.scope) {
          Object.keys(this.runtime.scope).forEach(key => {
            try {
              const value = this.runtime.getVariable(key);
              variables[key] = value;
            } catch (e) {
              // Ignorer les variables qu'on ne peut pas récupérer
            }
          });
        }
        
        // Générer une page HTML pour afficher les variables
        const html = `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Variables NekoScript</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            tr:nth-child(even) { background-color: #f9f9f9; }
          </style>
        </head>
        <body>
          <h1>Variables NekoScript disponibles</h1>
          <table>
            <tr>
              <th>Nom</th>
              <th>Valeur</th>
              <th>Type</th>
            </tr>
            ${Object.entries(variables).map(([key, value]) => `
              <tr>
                <td>${key}</td>
                <td>${typeof value === 'object' ? JSON.stringify(value) : String(value)}</td>
                <td>${typeof value}</td>
              </tr>
            `).join('')}
          </table>
        </body>
        </html>
        `;
        
        res.send(html);
      } catch (error) {
        res.status(500).send(`<h1>Erreur</h1><p>${error.message}</p>`);
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
   * Traite les variables utilisateur dans la configuration
   * Remplace toutes les références à des variables par leur valeur
   * @param {Object} config - Configuration fournie par l'utilisateur
   * @returns {Object} - Configuration avec variables remplacées
   */
  processVariables(config) {
    // Utiliser notre helper spécialisé pour le traitement des variables
    return this.siteHelper.processConfig(config);
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