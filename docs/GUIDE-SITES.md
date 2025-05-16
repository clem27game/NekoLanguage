# Guide complet pour créer des sites web avec NekoScript

Ce guide vous explique comment créer des sites web complets, responsifs et personnalisés en utilisant NekoScript. Vous apprendrez à utiliser efficacement les variables, styles et fonctions pour générer des sites web attractifs.

## Table des matières

1. [Introduction](#introduction)
2. [Méthodes de création de sites](#méthodes-de-création-de-sites)
3. [Utilisation du module neksite-module](#utilisation-du-module-neksite-module)
   - [Structure de base](#structure-de-base)
   - [Variables et personnalisation](#variables-et-personnalisation)
   - [Création de pages multiples](#création-de-pages-multiples)
   - [Styles et CSS personnalisé](#styles-et-css-personnalisé)
4. [Techniques avancées](#techniques-avancées)
   - [Fonctions de génération de contenu](#fonctions-de-génération-de-contenu)
   - [Intégration de données dynamiques](#intégration-de-données-dynamiques)
   - [Formulaires interactifs](#formulaires-interactifs)
5. [Exemples complets](#exemples-complets)
6. [Dépannage](#dépannage)
7. [Resources supplémentaires](#resources-supplémentaires)

## Introduction

NekoScript permet de créer facilement des sites web en utilisant une syntaxe simple et intuitive en français. Le système de génération de sites web inclut :

- Création de sites web multi-pages
- Gestion des styles et de la mise en page
- Support des variables personnalisées
- Intégration de contenu dynamique

## Méthodes de création de sites

NekoScript propose plusieurs approches pour créer des sites web :

1. **Module neksite-module (recommandé)** - Cette approche offre une API simple et fiable pour créer des sites multi-pages avec prise en charge complète des variables.

2. **Génération directe de HTML** - Approche plus avancée donnant un contrôle total sur le HTML généré en utilisant le module interne.

3. **Intégration avec des frameworks** - Pour les utilisateurs avancés, possibilité d'intégrer avec des frameworks comme Express pour des sites plus complexes.

## Utilisation du module neksite-module

### Structure de base

Voici la structure de base d'un script NekoScript pour créer un site :

```neko
// Importer le module neksite
nekImporter("neksite-module");

// Créer un site simple
neksite.créer {
  titre: "Mon Site NekoScript",
  description: "Description de mon site",
  
  pages: [
    {
      titre: "Accueil",
      nomFichier: "index.html",
      contenu: `<h1>Bienvenue sur mon site!</h1>`
    }
  ]
}
```

### Variables et personnalisation

Pour personnaliser votre site, utilisez des variables :

```neko
// Définir des variables globales
var monTitre = "Site Portfolio";
var couleurPrincipale = "#3498db";
var auteur = "Marie Dupont";

// Utiliser ces variables dans la création du site
neksite.créer {
  titre: monTitre,
  auteur: auteur,
  couleurPrincipale: couleurPrincipale,
  
  pages: [
    {
      titre: "Accueil",
      nomFichier: "index.html",
      contenu: `
        <h1 style="color: ${couleurPrincipale};">${monTitre}</h1>
        <p>Créé par ${auteur}</p>
      `
    }
  ]
}
```

### Création de pages multiples

Créez facilement plusieurs pages pour votre site :

```neko
neksite.créer {
  titre: "Site Multi-pages",
  
  pages: [
    {
      titre: "Accueil",
      nomFichier: "index.html",
      contenu: `
        <h1>Page d'accueil</h1>
        <p>Bienvenue sur mon site!</p>
        <a href="a-propos.html">À propos</a>
        <a href="contact.html">Contact</a>
      `
    },
    {
      titre: "À propos",
      nomFichier: "a-propos.html",
      contenu: `
        <h1>À propos</h1>
        <p>Informations sur notre entreprise...</p>
        <a href="index.html">Retour à l'accueil</a>
      `
    },
    {
      titre: "Contact",
      nomFichier: "contact.html",
      contenu: `
        <h1>Contact</h1>
        <form>
          <input type="text" placeholder="Votre nom">
          <input type="email" placeholder="Votre email">
          <button type="submit">Envoyer</button>
        </form>
        <a href="index.html">Retour à l'accueil</a>
      `
    }
  ]
}
```

### Styles et CSS personnalisé

Personnalisez l'apparence de votre site avec du CSS :

```neko
var couleurPrincipale = "#e74c3c";

neksite.créer {
  titre: "Site Stylé",
  couleurPrincipale: couleurPrincipale,
  
  // Ajouter du CSS personnalisé
  stylePersonnalise: `
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .header {
      background-color: ${couleurPrincipale};
      color: white;
      padding: 20px;
      text-align: center;
    }
    
    .footer {
      margin-top: 40px;
      border-top: 1px solid #ddd;
      padding-top: 20px;
      text-align: center;
    }
  `,
  
  pages: [
    {
      titre: "Accueil",
      nomFichier: "index.html",
      contenu: `
        <div class="header">
          <h1>Mon Site Stylé</h1>
        </div>
        
        <div class="container">
          <p>Contenu de la page...</p>
        </div>
        
        <div class="footer">
          <p>© 2025 - Tous droits réservés</p>
        </div>
      `
    }
  ]
}
```

## Techniques avancées

### Fonctions de génération de contenu

Utilisez des fonctions pour générer du contenu répétitif :

```neko
var projets = [
  { titre: "Projet 1", description: "Description du projet 1" },
  { titre: "Projet 2", description: "Description du projet 2" },
  { titre: "Projet 3", description: "Description du projet 3" }
];

fonction genererCartesProjets() {
  var html = "";
  
  pour i de 0 à projets.length - 1 {
    html = html + `
      <div class="projet-carte">
        <h3>${projets[i].titre}</h3>
        <p>${projets[i].description}</p>
      </div>
    `;
  }
  
  return html;
}

neksite.créer {
  titre: "Portfolio",
  
  pages: [
    {
      titre: "Projets",
      nomFichier: "index.html",
      contenu: `
        <h1>Mes Projets</h1>
        <div class="projets-grid">
          ${genererCartesProjets()}
        </div>
      `
    }
  ]
}
```

### Intégration de données dynamiques

Intégrez des données dynamiques dans votre site :

```neko
// Simuler des données provenant d'une API ou base de données
var articles = [
  {
    id: 1,
    titre: "Premier article",
    contenu: "Contenu du premier article...",
    date: "2025-01-15",
    auteur: "Jean Dupont"
  },
  {
    id: 2,
    titre: "Deuxième article",
    contenu: "Contenu du deuxième article...",
    date: "2025-02-20",
    auteur: "Marie Martin"
  }
];

// Fonction pour générer la page d'un article
fonction genererPageArticle(article) {
  return `
    <div class="article">
      <h1>${article.titre}</h1>
      <div class="meta">
        <span>Par ${article.auteur}</span>
        <span>Publié le ${article.date}</span>
      </div>
      <div class="contenu">
        ${article.contenu}
      </div>
      <a href="index.html">Retour à la liste</a>
    </div>
  `;
}

// Fonction pour générer la liste des articles
fonction genererListeArticles() {
  var html = "";
  
  pour i de 0 à articles.length - 1 {
    html = html + `
      <div class="article-apercu">
        <h2>${articles[i].titre}</h2>
        <p>Par ${articles[i].auteur} - ${articles[i].date}</p>
        <a href="article-${articles[i].id}.html">Lire la suite</a>
      </div>
    `;
  }
  
  return html;
}

// Créer le site avec une page pour chaque article
var pages = [
  {
    titre: "Blog",
    nomFichier: "index.html",
    contenu: `
      <h1>Mon Blog</h1>
      <div class="articles">
        ${genererListeArticles()}
      </div>
    `
  }
];

// Ajouter une page pour chaque article
pour i de 0 à articles.length - 1 {
  pages.ajouter({
    titre: articles[i].titre,
    nomFichier: "article-" + articles[i].id + ".html",
    contenu: genererPageArticle(articles[i])
  });
}

// Créer le site
neksite.créer {
  titre: "Mon Blog",
  pages: pages
}
```

### Formulaires interactifs

Créez des formulaires interactifs (note : cette fonctionnalité nécessite une configuration serveur pour traiter les formulaires) :

```neko
neksite.créer {
  titre: "Formulaire de contact",
  
  pages: [
    {
      titre: "Contact",
      nomFichier: "index.html",
      contenu: `
        <h1>Contactez-nous</h1>
        
        <form id="contactForm">
          <div class="form-group">
            <label for="nom">Nom</label>
            <input type="text" id="nom" name="nom" required>
          </div>
          
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required>
          </div>
          
          <div class="form-group">
            <label for="message">Message</label>
            <textarea id="message" name="message" rows="5" required></textarea>
          </div>
          
          <button type="submit">Envoyer</button>
        </form>
        
        <div id="confirmation" style="display: none;">
          <h2>Merci pour votre message!</h2>
          <p>Nous vous répondrons dans les plus brefs délais.</p>
        </div>
        
        <script>
          document.getElementById('contactForm').addEventListener('submit', function(e) {
            e.preventDefault();
            // Ici, en production, vous traiteriez le formulaire avec AJAX
            // Pour cet exemple, nous affichons simplement un message de confirmation
            document.getElementById('contactForm').style.display = 'none';
            document.getElementById('confirmation').style.display = 'block';
          });
        </script>
      `
    }
  ]
}
```

## Exemples complets

### Site portfolio professionnel

Consultez l'exemple complet dans `examples/demo-neksite.neko` pour voir comment créer un portfolio professionnel avec :

- Une mise en page responsive
- Un portfolio de projets avec galerie
- Un formulaire de contact fonctionnel
- Des styles personnalisés
- Une navigation intuitive entre les pages

### Blog avec articles

Consultez l'exemple dans `examples/blog-neksite.neko` pour voir comment créer un blog avec :

- Une page d'index listant les articles
- Des pages individuelles pour chaque article
- Un système de catégories
- Un design responsive

## Dépannage

### Problèmes courants et solutions

#### Les variables ne s'affichent pas correctement

Assurez-vous d'utiliser :
- Le module `neksite-module` et non l'ancien module `neksite`
- Des backticks (\`) pour les template literals, pas des guillemets simples ou doubles
- Le préfixe `var` pour déclarer vos variables

#### Erreur : "Cannot find module"

Si vous obtenez cette erreur concernant neksite-module :
- Vérifiez que vous avez bien placé le fichier `neksite-module.neko` dans le dossier `examples/`
- Essayez d'utiliser un chemin absolu : `nekImporter("./examples/neksite-module.neko")`

#### Les styles CSS ne s'appliquent pas

- Vérifiez que votre CSS est correctement formaté dans l'attribut `stylePersonnalise`
- Assurez-vous que les sélecteurs CSS correspondent à vos éléments HTML

## Resources supplémentaires

- [Exemple de portfolio](../examples/demo-neksite.neko) - Site portfolio complet
- [Exemple de blog](../examples/blog-neksite.neko) - Blog avec articles
- [Exemple de site e-commerce](../examples/boutique-neksite.neko) - Site e-commerce de base

Vous pouvez également modifier le serveur de sites (`serveur-site.js`) pour ajouter des fonctionnalités supplémentaires comme :
- Rechargement automatique lors des modifications
- Support des API backend
- Traitement des formulaires