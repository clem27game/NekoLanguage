/**
 * Module NekoSite pour NekoScript
 * Permet la création simplifiée de sites web
 */

const fs = require('fs');
const path = require('path');

class NekoSite {
  constructor(runtime) {
    this.runtime = runtime;
    this.pages = [];
    this.assets = [];
    this.outputDir = './site-output';
  }

  /**
   * Crée un nouveau site web avec les pages spécifiées
   * @param {Object} config - Configuration du site web
   */
  créer(config) {
    // Créer le répertoire de sortie s'il n'existe pas
    this.ensureOutputDirectory();

    // Traiter les pages et les configurations
    for (const page of config.pages || []) {
      this.createPage(page);
    }

    // Gérer les assets (images, etc.)
    for (const asset of this.assets) {
      this.copyAsset(asset);
    }

    console.log(`Site web créé avec succès dans le répertoire ${this.outputDir}`);
    console.log(`Pages créées: ${this.pages.map(page => page.title).join(', ')}`);

    return { success: true, pageCount: this.pages.length };
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
      this.pages.push({ title, path: filepath });
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
      }).join('\\n');
    }

    // Construire les liens
    let linksHTML = '';
    if (links && Array.isArray(links)) {
      linksHTML = links.map(link => {
        return `<a href="${link.url}">${link.text}</a>`;
      }).join('\\n  ');
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
      }
    } catch (error) {
      console.error(`Erreur lors de la copie de l'asset ${assetPath}:`, error);
    }
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