#!/bin/bash

# Script d'installation de NekoScript
# Ce script installe NekoScript et le rend accessible globalement sur le système

echo "=== Installation de NekoScript ==="
echo "🐱 NekoScript v1.0.0"
echo ""

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null
then
    echo "❌ Erreur: Node.js n'est pas installé."
    echo "Installez Node.js (v12 ou supérieur) avant de continuer:"
    echo "https://nodejs.org/fr/download/"
    exit 1
fi

# Vérifier la version de Node.js
NODE_VERSION=$(node -v | cut -d "v" -f 2 | cut -d "." -f 1)
if [ "$NODE_VERSION" -lt 12 ]; then
    echo "❌ Erreur: Version de Node.js trop ancienne (version $NODE_VERSION détectée)"
    echo "NekoScript nécessite Node.js v12 ou supérieur."
    exit 1
fi

echo "✅ Node.js v$NODE_VERSION détecté"

# Installer NekoScript globalement
echo ""
echo "📦 Installation de NekoScript via npm..."
npm install -g .

# Vérifier si l'installation a réussi
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ NekoScript a été installé avec succès!"
    echo ""
    echo "Pour vérifier l'installation:"
    echo "$ neko-script version"
    echo ""
    echo "Pour exécuter un exemple:"
    echo "$ neko-script exécuter examples/demo-rapide.neko"
    echo ""
    echo "Pour afficher l'aide:"
    echo "$ neko-script aide"
else
    echo ""
    echo "❌ Erreur lors de l'installation. Essayez d'installer manuellement:"
    echo "$ npm install -g ."
fi