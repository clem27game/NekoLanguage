#!/bin/bash

# Script de correction des dépendances pour NekoScript
# Ce script installe les dépendances requises pour NekoScript

echo "=== Correction des dépendances de NekoScript ==="
echo "🐱 NekoScript - Outil de réparation"
echo ""

# Vérifier si on a les droits d'administration
if [ "$EUID" -ne 0 ]; then
  echo "ℹ️ Note: Ce script n'est pas exécuté en tant qu'administrateur."
  echo "   Certaines opérations pourraient nécessiter des droits administrateurs."
  echo "   Si l'installation échoue, essayez d'exécuter ce script avec sudo."
  echo ""
fi

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

# Installation des dépendances nécessaires
echo ""
echo "📦 Installation des dépendances locales..."
npm install antlr4 sqlite3 --save
if [ $? -eq 0 ]; then
    echo "✅ Dépendances locales installées avec succès"
else
    echo "⚠️ Problème lors de l'installation des dépendances locales"
fi

# Installation des dépendances globales
echo ""
echo "📦 Installation des dépendances globales..."
npm install -g antlr4 sqlite3
if [ $? -eq 0 ]; then
    echo "✅ Dépendances globales installées avec succès"
else
    echo "⚠️ Problème lors de l'installation des dépendances globales"
fi

# Vérifier si NekoScript est installé
if command -v neko-script &> /dev/null
then
    echo ""
    echo "📦 Réinstallation de NekoScript..."
    npm install -g .
    if [ $? -eq 0 ]; then
        echo "✅ NekoScript réinstallé avec succès"
    else
        echo "⚠️ Problème lors de la réinstallation de NekoScript"
    fi
else
    echo ""
    echo "ℹ️ NekoScript n'est pas installé globalement."
    echo "   Pour l'installer, exécutez: npm install -g ."
fi

echo ""
echo "=== Vérification finale ==="
if npm list antlr4 &>/dev/null && npm list sqlite3 &>/dev/null; then
    echo "✅ Toutes les dépendances locales sont installées"
else
    echo "⚠️ Certaines dépendances locales pourraient manquer"
fi

if npm list -g antlr4 &>/dev/null && npm list -g sqlite3 &>/dev/null; then
    echo "✅ Toutes les dépendances globales sont installées"
else
    echo "⚠️ Certaines dépendances globales pourraient manquer"
fi

echo ""
echo "🎉 Processus de correction terminé!"
echo ""
echo "Pour tester si NekoScript fonctionne correctement, essayez d'exécuter:"
echo "neko-script exécuter examples/demo-rapide.neko"
echo ""
echo "Si le problème persiste, consultez la documentation sur:"
echo "https://github.com/votre-username/nekoscript#résolution-des-problèmes-courants"