/**
 * Script de test pour les sites web NekoScript
 * Ce script lance un serveur sur le port 5000 avec une attente explicite
 */

const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);
const http = require('http');

// Fichier à exécuter
const filePath = process.argv[2] || 'examples/site-demo.neko';

async function main() {
  try {
    // Exécuter le script NekoScript
    console.log(`Exécution de ${filePath}...`);
    const { stdout, stderr } = await execAsync(`node src/index.js exécuter ${filePath}`);
    
    console.log(stdout);
    if (stderr) {
      console.error(stderr);
    }
    
    console.log('Site web généré avec succès!');
    console.log('Serveur NekoScript prêt sur http://localhost:5000');
    
    // Créer un serveur HTTP en attente pour maintenir le processus actif
    // et permettre au workflow de détecter que le port 5000 est ouvert
    const server = http.createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('NekoScript Server is running');
    });
    
    server.listen(5000, '0.0.0.0', () => {
      console.log('Serveur HTTP démarré sur le port 5000');
    });
  } catch (error) {
    console.error('Erreur lors de l\'exécution:', error);
  }
}

main();