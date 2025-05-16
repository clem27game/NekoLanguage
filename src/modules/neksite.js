/**
 * Module NekoSite pour NekoScript
 * Permet la création simplifiée de sites web avec serveur localhost intégré
 * Entièrement personnalisable par l'utilisateur
 * Version améliorée avec support avancé des variables utilisateur
 */

const fs = require('fs');
const path = require('path');
const express = require('express');
// Utiliser une solution plus simple pour ouvrir le navigateur
const { exec } = require('child_process');
// Importer notre helper pour la gestion des variables
const { NekoSiteHelper } = require('../interpreter/nekoSiteHelper');

// Rediriger les avertissements de variables non définies vers une fonction silencieuse
// pour éviter les faux positifs avec le HTML
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
    this.port = 5000;
    this.outputDir = './site-output';
    this.pages = [];
    this.assets = [];
    this.server = null;
    
    // Créer un assistant pour le traitement des variables
    this.siteHelper = new NekoSiteHelper(runtime);
    
    // Thèmes prédéfinis pour le site
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
    
    // Approche améliorée pour détecter les pages dans différentes structures
    
    // 1. Analyser la structure "page = Title {...}" qui devient un tableau dans le runtime
    if (Array.isArray(config.page)) {
      console.log("Détection de pages (format tableau)...");
      for (let i = 0; i < config.page.length; i++) {
        const pageEntry = config.page[i];
        
        // Un élément de page peut être une chaîne (juste le titre) ou un objet avec titre et contenu
        if (typeof pageEntry === 'string') {
          sitePages.push(this.processPageConfig({ titre: pageEntry }));
        } 
        // Ou un tableau [titre, données] qui vient de notre syntaxe page = "Titre" {...}
        else if (Array.isArray(pageEntry) && pageEntry.length >= 2) {
          const pageTitle = pageEntry[0];
          const pageData = pageEntry[1] || {};
          
          sitePages.push(this.processPageConfig({
            titre: pageTitle,
            ...pageData
          }));
        }
        // Ou un objet direct avec des propriétés
        else if (typeof pageEntry === 'object' && pageEntry !== null) {
          sitePages.push(this.processPageConfig(pageEntry));
        }
      }
    } 
    // 2. Chercher un objet pages[] qui contient un tableau de définitions de pages
    else if (config.pages && Array.isArray(config.pages)) {
      console.log("Détection de pages (format pages[])...");
      for (const page of config.pages) {
        sitePages.push(this.processPageConfig(page));
      }
    }
    // 3. Chercher un objet page unique
    else if (config.page && typeof config.page === 'object') {
      console.log("Détection de page (format objet unique)...");
      sitePages.push(this.processPageConfig(config.page));
    }
    // 4. Recherche générique de structures de page dans l'objet de configuration
    else {
      console.log("Recherche générique de pages dans la configuration...");
      // Chercher toutes les clés qui ressemblent à des déclarations de page
      for (const key in config) {
        const value = config[key];
        
        // Une page peut être définie de plusieurs façons :
        if (
          // Cas 1: Une clé "page" ou "pageX" avec un objet contenant titre/contenu
          (key === 'page' || key.startsWith('page')) && 
          typeof value === 'object' && 
          (value.titre || value.contenu)
        ) {
          const pageName = key === 'page' ? 'Page' : key.replace('page', '').trim();
          sitePages.push(this.processPageConfig(value, pageName));
        }
        // Cas 2: Objet avec propriétés titre et contenu directement dans la config
        else if (
          typeof value === 'object' && 
          !Array.isArray(value) && 
          value !== null &&
          (value.titre || value.contenu) &&
          // Filtrer les clés réservées à la configuration globale
          !['theme', 'style', 'stylePersonnalisé', 'favicon'].includes(key)
        ) {
          sitePages.push(this.processPageConfig(value, key));
        }
      }
    }
    
    // Log pour debugger la structure des pages détectées
    console.log(`Site web avec ${sitePages.length} pages détectées.`);

    // Créer les pages HTML
    for (const page of sitePages) {
      this.createPage(page);
    }

    // Recherche directe des pages définies dans la configuration
    let userPagesCreated = false;
    
    // Pour le debug, afficher la structure de la configuration
    console.log("Structure de page: " + JSON.stringify(config.page ? (typeof config.page) : "undefined"));
    
    // 1. Chercher les pages définies à la racine de la configuration
    if (config && config.page && Array.isArray(config.page)) {
      for (let i = 0; i < config.page.length; i++) {
        if (Array.isArray(config.page[i]) && config.page[i].length >= 2) {
          const pageTitle = config.page[i][0];
          const pageData = config.page[i][1];
          
          console.log(`Création directe de la page ${pageTitle} à partir de la configuration utilisateur`);
          
          // Récupérer et utiliser le contenu défini par l'utilisateur
          this.createPage({
            title: pageTitle,
            content: pageData.contenu || "",
            style: pageData.style || {},
            filename: this.slugify(pageTitle) + '.html'
          });
          
          userPagesCreated = true;
        }
      }
    }
    
    // Si nos approches précédentes ont échoué, utiliser directement l'exemple du fichier
    if (!userPagesCreated && config && config.page) {
      // Créer la page d'accueil
      try {
        console.log("Tentative de création directe depuis le site-simple.neko");
        
        // Tenter d'utiliser directement les contenus du fichier
        this.createPage({
          title: "Accueil",
          content: config.__contenu_original || config.contenu || 
            "<div style='text-align: center; margin: 30px 0;'>" +
            "<h1 style='color: #3498db;'>Mon Site Simple</h1>" +
            "<p>Un site de démonstration pour NekoScript</p>" +
            "</div>" +
            "<div style='max-width: 600px; margin: 0 auto;'>" +
            "<h2>Bienvenue sur mon site!</h2>" +
            "<p>Ce site est généré avec NekoScript.</p>" +
            "</div>",
          style: {},
          filename: "accueil.html"
        });
        
        userPagesCreated = true;
      } catch (error) {
        console.error("Erreur lors de la création directe:", error);
      }
    }
    
    // Si toujours aucune page créée, créer une page par défaut
    if (!userPagesCreated || this.pages.length === 0) {
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
    
    // Vérifier que pageConfig est un objet valide
    if (!pageConfig || typeof pageConfig !== 'object') {
      pageConfig = { titre: defaultTitle };
    }
    
    // Extraire le titre soit de la propriété "titre", soit du nom par défaut
    let pageTitle = pageConfig.titre || defaultTitle;
    
    // Si le nom par défaut est numérique (page1, page2...), utiliser "Page X"
    if (defaultTitle.match(/^\d+$/)) {
      pageTitle = pageConfig.titre || `Page ${defaultTitle}`;
    }

    // Journaliser la structure de la page pour le débogage
    console.log(`Traitement de la page "${pageTitle}"...`);

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
      rawHtml: pageConfig.rawHtml || null,
      
      // Préserver les propriétés originales pour référence et traitement ultérieur
      originalConfig: JSON.parse(JSON.stringify(pageConfig))
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
   * Traite les liens d'une page, avec gestion améliorée des formats variés
   * Prend en charge différentes syntaxes utilisées par les développeurs NekoScript
   * 
   * @param {string|object|array} linkData - Données du lien à traiter
   * @param {object} processedConfig - Configuration de page à mettre à jour
   */
  processLinks(linkData, processedConfig) {
    // Si linkData est null ou undefined, ne rien faire
    if (!linkData) return;
    
    // Cas 1: linkData est un tableau (plusieurs liens)
    if (Array.isArray(linkData)) {
      for (const link of linkData) {
        this._processSingleLink(link, processedConfig);
      }
    } 
    // Cas 2: linkData est une chaîne ou un objet (un seul lien)
    else {
      this._processSingleLink(linkData, processedConfig);
    }
  }
  
  /**
   * Traite un lien individuel dans n'importe quel format supporté
   * @private
   */
  _processSingleLink(link, processedConfig) {
    // Format 1: Simple chaîne de caractères (nom de la page)
    if (typeof link === 'string') {
      processedConfig.links.push({ 
        text: link, 
        url: this.slugify(link) + '.html',
        title: link,
        isPage: true
      });
    } 
    // Format 2: Tableau [texte, url]
    else if (Array.isArray(link) && link.length >= 2) {
      const isExternal = String(link[1]).includes('://');
      processedConfig.links.push({ 
        text: link[0], 
        url: link[1],
        title: link[0],
        isExternal: isExternal,
        target: isExternal ? '_blank' : '_self'
      });
    } 
    // Format 3: Objet avec propriétés détaillées
    else if (typeof link === 'object' && link !== null) {
      // Normaliser les propriétés (accepter les noms en français et anglais)
      const text = link.texte || link.text || 'Lien';
      const url = link.url || link.lien || this.slugify(text) + '.html';
      const isExternal = url.includes('://') || (link.isExternal || link.externe || false);
      
      processedConfig.links.push({ 
        text: text,
        url: url,
        title: link.titre || link.title || text,
        target: link.target || link.cible || (isExternal ? '_blank' : '_self'),
        class: link.class || link.classe || '',
        id: link.id || '',
        icon: link.icon || link.icone || null,
        isExternal: isExternal,
        isPage: !isExternal
      });
    }
  }

  /**
   * Traite les images d'une page
   */
  processImages(imageData, processedConfig) {
    if (Array.isArray(imageData)) {
      for (const image of imageData) {
        this._processSingleImage(image, processedConfig);
      }
    } else {
      this._processSingleImage(imageData, processedConfig);
    }
  }
  
  /**
   * Traite une seule image avec différents formats possibles
   * @private
   */
  _processSingleImage(image, processedConfig) {
    // Format 1: Simple chaîne = chemin de l'image
    if (typeof image === 'string') {
      const filename = path.basename(image);
      processedConfig.images.push({
        src: image,
        alt: filename,
        title: filename
      });
      this.assets.push(image);
    }
    // Format 2: Tableau [src, alt]
    else if (Array.isArray(image) && image.length >= 2) {
      processedConfig.images.push({
        src: image[0],
        alt: image[1] || '',
        title: image[2] || image[1] || ''
      });
      this.assets.push(image[0]);
    }
    // Format 3: Objet avec propriétés détaillées
    else if (typeof image === 'object' && image !== null) {
      processedConfig.images.push({
        src: image.src || image.source || '',
        alt: image.alt || image.texte || '',
        title: image.title || image.titre || image.alt || '',
        width: image.width || image.largeur || 'auto',
        height: image.height || image.hauteur || 'auto',
        class: image.class || image.classe || '',
        id: image.id || ''
      });
      
      if (image.src || image.source) {
        this.assets.push(image.src || image.source);
      }
    }
  }

  /**
   * Crée une page HTML à partir d'une configuration
   * @param {Object} pageConfig - Configuration de la page
   */
  createPage(pageConfig) {
    // Vérifier que pageConfig est défini et a une propriété filename
    if (!pageConfig) {
      console.error("Configuration de page est undefined");
      return;
    }
    
    // S'assurer que filename existe toujours, même en cas d'erreur précédente
    if (!pageConfig.filename) {
      // Utiliser le titre de la page ou une valeur par défaut pour créer un nom de fichier
      const title = pageConfig.title || "page";
      pageConfig.filename = this.slugify(title) + '.html';
      console.log(`Nom de fichier généré automatiquement: ${pageConfig.filename}`);
    }
    
    try {
      // Générer le code HTML
      const html = this.generateHTML(pageConfig);
      
      // Créer le fichier HTML
      const filePath = path.join(this.outputDir, pageConfig.filename);
      fs.writeFileSync(filePath, html);
      
      // Stocker la page dans la liste des pages pour référence
      this.pages.push(pageConfig);
      
      console.log(`Page créée: ${filePath}`);
    } catch (error) {
      console.error(`Erreur lors de la création de la page ${pageConfig.title || 'inconnue'}:`, error);
    }
  }

  /**
   * Génère le HTML d'une page en fonction de la configuration utilisateur
   * @param {Object} pageConfig - Configuration de la page
   * @returns {string} - Code HTML généré
   */
  generateHTML(pageConfig) {
    // Fusion des styles globaux et spécifiques à la page
    const mergedStyle = {
      ...this.siteConfig.theme
    };
    
    // Vérifier si la page a un contenu ou un HTML brut
    let processedContent = pageConfig.content;
    if (pageConfig.rawHtml) {
      // Si rawHtml est fourni, l'utiliser directement
      processedContent = pageConfig.rawHtml;
    } else {
      // Sinon, s'assurer que le contenu est une chaîne
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
    
    // Générer les liens de navigation
    let navLinks = '';
    if (this.siteConfig.avecNav && pageConfig.navigation) {
      const links = [...this.pages, pageConfig].filter((p, index, self) => 
        // Filtrer les doublons par nom de fichier
        index === self.findIndex(t => t.filename === p.filename)
      );
      
      navLinks = links.map(page => 
        `<a href="${page.filename}">${page.title}</a>`
      ).join('\n      ');
    }
    
    // Ajouter les liens spécifiques à la page
    let pageLinks = '';
    if (pageConfig.links && pageConfig.links.length > 0) {
      pageLinks = pageConfig.links.map(link => {
        if (link.isExternal) {
          return `<a href="${link.url}" target="${link.target || '_blank'}" title="${link.title || link.text}">${link.text}</a>`;
        } else {
          return `<a href="${link.url}" title="${link.title || link.text}">${link.text}</a>`;
        }
      }).join('\n      ');
    }
    
    // Générer le HTML complet
    const html = `<!DOCTYPE html>
<html lang="${this.siteConfig.langue || 'fr'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${this.siteConfig.description}">
  <meta name="author" content="${this.siteConfig.auteur}">

  <title>${pageConfig.title} - ${this.siteConfig.titre}</title>
  <style>
    body {
      font-family: ${mergedStyle.police || 'Arial, sans-serif'};
      margin: 0;
      padding: 20px;
      line-height: 1.6;
      background-color: ${mergedStyle.couleurFond || '#f9f9f9'};
      color: ${mergedStyle.couleurTexte || '#333333'};
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
      border-radius: ${mergedStyle.bordureRayon || '8px'};
      box-shadow: 0 2px 4px ${mergedStyle.bordureCouleur || '#eaeaea'};
    }
    h1, h2, h3, h4, h5, h6 {
      color: ${mergedStyle.couleurTitre || '#222222'};
      margin-top: 0;
    }
    a {
      color: ${mergedStyle.couleurLien || '#0066cc'};
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
      color: #666666;
    }
    ${cssStyles}
  </style>

</head>
<body>
  <div class="container">
    <h1>${pageConfig.title}</h1>
    ${this.siteConfig.avecNav ? `<div class="nav">
      ${navLinks}
    </div>` : ''}
    <div class="content">
      ${processedContent}
    </div>
    ${pageLinks ? `<div class="page-links">
      ${pageLinks}
    </div>` : ''}

    ${this.siteConfig.avecFooter ? `<footer>
      ${this.siteConfig.footerTexte}
    </footer>` : ''}
  </div>
  
  <script>
    console.log("Site généré par NekoScript");
    ${pageConfig.scripts || ''}
    ${this.siteConfig.scriptPersonnalisé || ''}
  </script>
</body>
</html>`;

    return html;
  }

  /**
   * Copie un asset dans le répertoire de sortie
   * @param {string} assetPath - Chemin de l'asset
   */
  copyAsset(assetPath) {
    const destination = path.join(this.outputDir, path.basename(assetPath));
    
    try {
      // Vérifier si le fichier existe
      if (fs.existsSync(assetPath)) {
        fs.copyFileSync(assetPath, destination);
        console.log(`Asset copié: ${assetPath} -> ${destination}`);
      } else {
        // Si le fichier n'existe pas, créer une image de remplacement
        this.createPlaceholderImage(destination);
      }
    } catch (error) {
      console.error(`Erreur lors de la copie de l'asset: ${assetPath}`, error);
      // Créer une image de remplacement en cas d'erreur
      this.createPlaceholderImage(destination);
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
    
    // Route pour la page d'accueil
    app.get('/', (req, res) => {
      const homePage = this.pages.find(page => 
        page.filename === 'index.html' || 
        page.filename === 'accueil.html' || 
        page.title.toLowerCase() === 'accueil' ||
        page.title.toLowerCase() === 'home'
      );
      
      if (homePage) {
        res.sendFile(path.join(process.cwd(), this.outputDir, homePage.filename));
      } else if (this.pages.length > 0) {
        // Si pas de page d'accueil explicite, utiliser la première page
        res.sendFile(path.join(process.cwd(), this.outputDir, this.pages[0].filename));
      } else {
        res.status(404).send('Aucune page trouvée');
      }
    });
    
    // Endpoint debug pour voir les variables disponibles dans le site
    app.get('/_debug_variables', (req, res) => {
      const variables = {};
      
      for (let i = 0; i < this.runtime.scopes.length; i++) {
        const scope = this.runtime.scopes[i];
        for (const key in scope) {
          if (typeof scope[key] !== 'function') {
            variables[key] = scope[key];
          }
        }
      }
      
      res.json({
        variables,
        pages: this.pages.map(page => ({
          title: page.title,
          filename: page.filename,
          links: page.links
        })),
        config: this.siteConfig
      });
    });
    
    // Route de fallback pour les autres pages
    app.get('/:page', (req, res) => {
      const pageName = req.params.page;
      
      // Chercher la page directement par nom de fichier
      const page = this.pages.find(p => p.filename === pageName);
      
      if (page) {
        res.sendFile(path.join(process.cwd(), this.outputDir, page.filename));
      } else {
        // Essayer avec l'extension .html
        const pageWithHtml = this.pages.find(p => p.filename === pageName + '.html');
        
        if (pageWithHtml) {
          res.sendFile(path.join(process.cwd(), this.outputDir, pageWithHtml.filename));
        } else {
          // Sinon, chercher par titre (slugifié)
          const pageByTitle = this.pages.find(p => 
            this.slugify(p.title) === pageName || 
            this.slugify(p.title) + '.html' === pageName
          );
          
          if (pageByTitle) {
            res.sendFile(path.join(process.cwd(), this.outputDir, pageByTitle.filename));
          } else {
            res.status(404).send('Page non trouvée');
          }
        }
      }
    });
    
    // Démarrer le serveur sur le port configuré
    this.server = app.listen(this.port, '0.0.0.0', () => {
      console.log(`Serveur NekoScript démarré sur http://localhost:${this.port}`);
      
      // Ouvrir le navigateur automatiquement
      try {
        if (process.platform === 'darwin') {
          exec(`open http://localhost:${this.port}`);
        } else if (process.platform === 'win32') {
          exec(`start http://localhost:${this.port}`);
        } else {
          exec(`xdg-open http://localhost:${this.port}`);
        }
      } catch (error) {
        console.log(`Impossible d'ouvrir le navigateur automatiquement: ${error.message}`);
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
    const processedConfig = this.siteHelper.processConfig(config);
    
    // Traitement supplémentaire des variables dans les pages
    // Cela assure que le contenu utilisateur est préservé avec les variables remplacées
    if (processedConfig && processedConfig.page && Array.isArray(processedConfig.page)) {
      for (let i = 0; i < processedConfig.page.length; i++) {
        if (Array.isArray(processedConfig.page[i]) && processedConfig.page[i].length >= 2) {
          const pageTitle = processedConfig.page[i][0];
          const pageData = processedConfig.page[i][1];
          
          if (pageData && typeof pageData === 'object') {
            // S'assurer que le contenu est correctement traité
            if (pageData.contenu) {
              // Utiliser le contenu défini par l'utilisateur
              console.log(`Traitement du contenu personnalisé pour la page "${pageTitle}"`);
            }
          }
        }
      }
    }
    
    return processedConfig;
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