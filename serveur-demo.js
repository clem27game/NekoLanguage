/**
 * Serveur de démonstration pour les sites NekoScript
 * Ce script démarre un serveur Express qui sert les fichiers statiques
 * générés par les exemples de site NekoScript
 */

const express = require('express');
const path = require('path');

// Créer une application Express
const app = express();

// Définir le chemin vers le répertoire de sortie généré par NekoScript
const outputDir = path.join(__dirname, 'site-output');

// Servir les fichiers statiques depuis le répertoire de sortie
app.use(express.static(outputDir));

// Route pour la page d'accueil
app.get('/', (req, res) => {
  res.sendFile(path.join(outputDir, 'accueil.html'));
});

// Route pour la page À propos
app.get('/a-propos', (req, res) => {
  res.sendFile(path.join(outputDir, 'a-propos.html'));
});

// Route pour la page Contact
app.get('/contact', (req, res) => {
  res.sendFile(path.join(outputDir, 'contact.html'));
});

// Route de fallback pour les pages non trouvées
app.use((req, res) => {
  res.status(404).send('Page non trouvée');
});

// Démarrer le serveur sur le port 5000
const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Serveur de démonstration NekoScript démarré sur http://localhost:${PORT}`);
});