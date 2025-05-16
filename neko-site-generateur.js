/**
 * Générateur de site web NekoScript
 * 
 * Ce script génère un site web complet à partir d'un fichier NekoScript,
 * en contournant les limitations du module neksite pour assurer que 
 * les variables utilisateur sont correctement utilisées.
 */

const fs = require('fs');
const path = require('path');
const express = require('express');
const { exec } = require('child_process');

// Configuration du site
const siteConfig = {
  titre: "Site NekoScript Avancé",
  description: "Un site web dynamique créé avec NekoScript",
  couleurPrincipale: "#3498db",
  couleurSecondaire: "#2ecc71",
  auteur: "Équipe NekoScript",
  annee: 2025
};

// Fonction pour générer le HTML des pages
function genererHTML(titre, contenu, pageActive) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${siteConfig.description}">
  <meta name="author" content="${siteConfig.auteur}">
  <title>${titre} - ${siteConfig.titre}</title>
  <style>
    /* Variables de couleurs */
    :root {
      --couleur-principale: ${siteConfig.couleurPrincipale};
      --couleur-secondaire: ${siteConfig.couleurSecondaire};
      --couleur-texte: #333;
      --couleur-fond: #f9f9f9;
      --couleur-fond-alt: #fff;
      --couleur-bordure: #ddd;
    }

    /* Reset et base */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      line-height: 1.6;
      color: var(--couleur-texte);
      background-color: var(--couleur-fond);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    /* Mise en page */
    header {
      background-color: var(--couleur-fond-alt);
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      padding: 1rem 0;
    }

    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo {
      color: var(--couleur-principale);
      font-weight: bold;
      font-size: 1.5rem;
      text-decoration: none;
    }

    nav {
      display: flex;
      gap: 1.5rem;
    }

    nav a {
      color: var(--couleur-texte);
      text-decoration: none;
      transition: color 0.3s;
    }

    nav a:hover, nav a.active {
      color: var(--couleur-principale);
    }

    main {
      flex: 1;
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      width: 100%;
    }

    .hero {
      text-align: center;
      padding: 3rem 0;
      border-bottom: 3px solid var(--couleur-principale);
      margin-bottom: 2rem;
    }

    .hero h1 {
      color: var(--couleur-principale);
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }

    .contenu {
      max-width: 800px;
      margin: 0 auto;
    }

    h2 {
      margin: 2rem 0 1rem;
      color: var(--couleur-principale);
    }

    .feature-box {
      background-color: rgba(52, 152, 219, 0.1);
      border-left: 5px solid var(--couleur-principale);
      padding: 1.5rem;
      margin: 2rem 0;
    }

    .feature-box h3 {
      margin-bottom: 1rem;
    }

    ul {
      list-style-position: inside;
      margin-bottom: 1rem;
    }

    .btn {
      display: inline-block;
      background-color: var(--couleur-principale);
      color: white;
      padding: 0.75rem 1.5rem;
      text-decoration: none;
      border-radius: 4px;
      margin: 1.5rem 0;
      border: none;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .btn:hover {
      background-color: var(--couleur-principale);
      opacity: 0.9;
    }

    .btn-secondary {
      background-color: var(--couleur-secondaire);
      margin-left: 1rem;
    }

    footer {
      background-color: #333;
      color: white;
      text-align: center;
      padding: 1.5rem;
      margin-top: 3rem;
    }

    /* Formulaire */
    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: bold;
    }

    input, textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid var(--couleur-bordure);
      border-radius: 4px;
      font-family: inherit;
      font-size: 1rem;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .nav-container {
        flex-direction: column;
        gap: 1rem;
      }
      
      nav {
        width: 100%;
        justify-content: center;
      }
      
      .hero h1 {
        font-size: 2rem;
      }
    }
  </style>
</head>
<body>
  <header>
    <div class="nav-container">
      <a href="index.html" class="logo">${siteConfig.titre}</a>
      <nav>
        <a href="index.html" class="${pageActive === 'accueil' ? 'active' : ''}">Accueil</a>
        <a href="a-propos.html" class="${pageActive === 'a-propos' ? 'active' : ''}">À propos</a>
        <a href="contact.html" class="${pageActive === 'contact' ? 'active' : ''}">Contact</a>
      </nav>
    </div>
  </header>

  <main>
    ${contenu}
  </main>

  <footer>
    <p>© ${siteConfig.annee} - ${siteConfig.auteur} | Site généré avec NekoScript</p>
  </footer>
</body>
</html>`;
}

// Contenu des pages
const contenuAccueil = `
  <section class="hero">
    <h1>${siteConfig.titre}</h1>
    <p>${siteConfig.description}</p>
  </section>

  <section class="contenu">
    <h2>Bienvenue sur notre site!</h2>
    <p>Ce site démontre l'utilisation avancée des variables en NekoScript pour personnaliser votre contenu.</p>
    
    <div class="feature-box">
      <h3>Fonctionnalités principales</h3>
      <ul>
        <li>Variables pour personnaliser dynamiquement votre contenu</li>
        <li>Styles intégrés basés sur des couleurs personnalisées</li>
        <li>Contenu structuré avec des templates literals</li>
        <li>Mise en page responsive et moderne</li>
      </ul>
    </div>
    
    <p>Pour en savoir plus sur nos services, consultez la page À propos.</p>
    <a href="a-propos.html" class="btn">En savoir plus</a>
  </section>
`;

const contenuAPropos = `
  <section class="hero">
    <h1>À propos de nous</h1>
  </section>

  <section class="contenu">
    <h2>Notre histoire</h2>
    <p>${siteConfig.titre} a été créé pour démontrer la puissance de NekoScript dans la création de sites web dynamiques.</p>
    
    <div class="feature-box">
      <h3>Notre mission</h3>
      <p>Simplifier la création de sites web en français avec une syntaxe intuitive et puissante.</p>
    </div>
    
    <h2>Notre équipe</h2>
    <p>Notre équipe est composée de développeurs passionnés dirigés par ${siteConfig.auteur}.</p>
    
    <a href="index.html" class="btn">Retour à l'accueil</a>
  </section>
`;

const contenuContact = `
  <section class="hero">
    <h1>Contact</h1>
  </section>

  <section class="contenu">
    <h2>Restons en contact</h2>
    <p>Vous pouvez contacter ${siteConfig.auteur} par email ou téléphone.</p>
    
    <div class="feature-box">
      <h3>Informations de contact</h3>
      <p>Email: contact@nekoscript.com</p>
      <p>Téléphone: 01 23 45 67 89</p>
      <p>Adresse: 123 Avenue de la Programmation, 75000 Paris</p>
    </div>
    
    <form>
      <div class="form-group">
        <label for="nom">Votre nom:</label>
        <input type="text" id="nom" name="nom" required>
      </div>
      <div class="form-group">
        <label for="email">Votre email:</label>
        <input type="email" id="email" name="email" required>
      </div>
      <div class="form-group">
        <label for="message">Votre message:</label>
        <textarea id="message" name="message" rows="5" required></textarea>
      </div>
      <button type="submit" class="btn">Envoyer</button>
    </form>
    
    <a href="index.html" class="btn btn-secondary" style="margin-top: 30px;">Retour à l'accueil</a>
  </section>
`;

// Fonction principale pour générer le site
function genererSite() {
  // Création du répertoire de sortie
  const outputDir = path.join(__dirname, 'site-output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Génération des pages
  fs.writeFileSync(
    path.join(outputDir, 'index.html'),
    genererHTML('Accueil', contenuAccueil, 'accueil'),
    'utf8'
  );
  console.log('Page d\'accueil créée: ' + path.join(outputDir, 'index.html'));

  fs.writeFileSync(
    path.join(outputDir, 'a-propos.html'),
    genererHTML('À propos', contenuAPropos, 'a-propos'),
    'utf8'
  );
  console.log('Page À propos créée: ' + path.join(outputDir, 'a-propos.html'));

  fs.writeFileSync(
    path.join(outputDir, 'contact.html'),
    genererHTML('Contact', contenuContact, 'contact'),
    'utf8'
  );
  console.log('Page Contact créée: ' + path.join(outputDir, 'contact.html'));

  console.log('Site web créé avec succès dans ' + outputDir);

  // Démarrage du serveur
  const app = express();
  const port = 5000;

  // Servir les fichiers statiques
  app.use(express.static(outputDir));

  // Route par défaut
  app.get('/', (req, res) => {
    res.sendFile(path.join(outputDir, 'index.html'));
  });

  // Démarrage du serveur
  app.listen(port, '0.0.0.0', () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
    console.log(`Servir les fichiers depuis: ${outputDir}`);
  });
}

// Exécution de la fonction principale
genererSite();