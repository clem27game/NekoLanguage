/**
 * Script d'initialisation de la base de données pour les packages NekoScript
 */

const packageDatabase = require('./pkg-schema');

async function initializeDatabase() {
  try {
    console.log('Initialisation de la base de données des packages NekoScript...');
    
    await packageDatabase.initialize();
    
    console.log('Base de données initialisée avec succès !');
    
    // Ajouter quelques packages d'exemple
    await addExamplePackages();
    
    console.log('Packages d\'exemple ajoutés avec succès !');
    process.exit(0);
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la base de données:', error);
    process.exit(1);
  }
}

async function addExamplePackages() {
  // Package neksite pour la création de sites web
  const neksitePackage = `
/**
 * Module NekoSite pour NekoScript
 * Permet la création simplifiée de sites web
 */

// Utiliser ce module avec:
// nekImporter("neksite");
// neksite.créer { ... }

neksite = {
  créer: function(config) {
    neko = ("Création d'un site web...");
    
    // Récupérer les pages
    let pages = config.pages || [];
    
    if (pages.length === 0) {
      neko = ("Aucune page n'a été spécifiée.");
      neko = ("Exemple d'utilisation:");
      neko = ("  neksite.créer {");
      neko = ("    page = \\"Accueil\\" {");
      neko = ("      titre: \\"Mon Site\\";");
      neko = ("      contenu: \\"Bienvenue sur mon site!\\";");
      neko = ("    }");
      neko = ("  }");
      return;
    }
    
    // Afficher les pages qui seront créées
    neko = (pages.length + " page(s) à créer:");
    
    for (const page of pages) {
      neko = ("- " + page.titre);
    }
    
    neko = ("Site créé avec succès!");
    
    return { success: true };
  }
};
`;

  // Package nekmath pour les opérations mathématiques avancées
  const nekmathPackage = `
/**
 * Module NekMath pour NekoScript
 * Fonctions mathématiques avancées pour NekoScript
 */

// Utiliser ce module avec:
// nekImporter("nekmath");
// resultat = nekmath.puissance(2, 8);

nekmath = {
  // Calcule la puissance d'un nombre
  puissance: function(base, exposant) {
    let resultat = 1;
    for (let i = 0; i < exposant; i++) {
      resultat = resultat multiplier base;
    }
    return resultat;
  },
  
  // Calcule la racine carrée (approximative)
  racineCarrée: function(nombre) {
    // Méthode de Newton pour la racine carrée
    let x = nombre;
    let y = 1;
    let precision = 0.000001;
    
    while (x moins y > precision) {
      x = (x plus y) diviser 2;
      y = nombre diviser x;
    }
    
    return x;
  },
  
  // Calcule le factoriel d'un nombre
  factoriel: function(n) {
    si (n égal 0 ou n égal 1) {
      retourner 1;
    }
    let resultat = 1;
    pour (i de 2 à n) {
      resultat = resultat multiplier i;
    }
    return resultat;
  },
  
  // Calcule la suite de Fibonacci
  fibonacci: function(n) {
    si (n égal 0) retourner 0;
    si (n égal 1) retourner 1;
    
    let a = 0;
    let b = 1;
    let temp;
    
    pour (i de 2 à n) {
      temp = a plus b;
      a = b;
      b = temp;
    }
    
    return b;
  }
};
`;

  // Ajouter les packages d'exemple
  await packageDatabase.publishPackage('neksite', neksitePackage, 'nekoScript', {
    version: '1.0.0',
    author: 'Équipe NekoScript',
    description: 'Module pour la création simplifiée de sites web avec NekoScript'
  });
  
  await packageDatabase.publishPackage('nekmath', nekmathPackage, 'nekoScript', {
    version: '1.0.0',
    author: 'Équipe NekoScript',
    description: 'Fonctions mathématiques avancées pour NekoScript'
  });
}

// Exécuter le script d'initialisation
initializeDatabase();