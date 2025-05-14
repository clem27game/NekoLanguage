# Contribuer à NekoScript

Nous sommes ravis que vous envisagiez de contribuer à NekoScript ! Voici comment vous pouvez nous aider à améliorer le langage.

## Types de contributions

Vous pouvez contribuer à NekoScript de plusieurs façons :

- 🐛 **Signaler des bugs** : Si vous trouvez un bug, veuillez créer une issue en décrivant le problème, les étapes pour le reproduire et l'environnement dans lequel il se produit.
- 🚀 **Proposer des améliorations** : Soumettez des idées pour de nouvelles fonctionnalités ou l'amélioration de fonctionnalités existantes.
- 📖 **Documentation** : Aidez-nous à améliorer la documentation, qu'il s'agisse de corriger des fautes d'orthographe ou d'ajouter des exemples utiles.
- 💻 **Code** : Contribuez directement au code source de NekoScript.
- 📦 **Bibliothèques** : Créez et partagez des bibliothèques pour NekoScript.
- 🌐 **Traductions** : Bien que NekoScript soit principalement en français, nous accueillons les traductions de la documentation.

## Processus de contribution

### 1. Fork du dépôt

- Créez un fork du dépôt NekoScript sur GitHub.
- Clonez votre fork sur votre machine locale.

```bash
git clone https://github.com/VOTRE_NOM_UTILISATEUR/neko-script.git
cd neko-script
```

### 2. Création d'une branche

Créez une branche pour votre contribution :

```bash
git checkout -b ma-contribution
```

### 3. Développement

- Suivez les [conventions de codage](#conventions-de-codage) décrites ci-dessous.
- Assurez-vous que votre code est testé.
- Mettez à jour la documentation si nécessaire.

### 4. Soumission d'une Pull Request

- Poussez vos modifications vers votre fork :

```bash
git push origin ma-contribution
```

- Ouvrez une Pull Request sur le dépôt principal de NekoScript.
- Décrivez clairement vos changements et pourquoi ils sont nécessaires.

## Conventions de codage

### Style de code

- Utilisez 2 espaces pour l'indentation.
- Utilisez des noms de variables et de fonctions explicites.
- Commentez votre code lorsque nécessaire.

### Grammaire NekoScript

Si vous modifiez la grammaire ANTLR4 :

1. Toujours s'assurer que vos modifications sont compatibles avec les scripts existants.
2. Mettez à jour les tests pour vérifier que l'analyseur syntaxique fonctionne correctement.
3. Documentez les nouvelles fonctionnalités ou modifications de syntaxe.

### Tests

- Écrivez des tests pour toutes les nouvelles fonctionnalités.
- Vérifiez que tous les tests existants passent avant de soumettre une PR.

## Structure du projet

Pour vous aider à vous orienter, voici la structure générale du projet :

```
neko-script/
├── bin/               # Fichiers exécutables
├── src/
│   ├── cli/           # Interface en ligne de commande
│   ├── grammar/       # Grammaire ANTLR4
│   ├── interpreter/   # Interpréteur du langage
│   └── packageManager/# Gestionnaire de packages
├── examples/          # Exemples de scripts
├── tests/             # Tests
└── docs/              # Documentation
```

## Développement local

### Installation des dépendances

```bash
npm install
```

### Compilation de la grammaire

Si vous modifiez la grammaire ANTLR4, vous devrez la recompiler :

```bash
npm run build:grammar
```

### Exécution des tests

```bash
npm test
```

### Exécution d'un script NekoScript

```bash
node src/index.js exécuter examples/hello.neko
```

## Communication

- Pour les discussions générales, utilisez le canal Discord ou le forum communautaire.
- Pour signaler des bugs ou proposer des fonctionnalités, créez une issue sur GitHub.

## Licence

En contribuant à NekoScript, vous acceptez que vos contributions soient sous la même licence que le projet (MIT).