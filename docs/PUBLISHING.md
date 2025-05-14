# Guide de Publication de NekoScript

Ce document explique comment publier NekoScript sur GitHub et npm pour le rendre accessible à tous.

## Publication sur GitHub

1. Créez un nouveau dépôt sur GitHub (par exemple, "nekoscript")
2. Initialisez votre dépôt local et poussez-le sur GitHub :

```bash
git init
git add .
git commit -m "Version initiale de NekoScript"
git branch -M main
git remote add origin https://github.com/votre-username/nekoscript.git
git push -u origin main
```

3. Vérifiez que tous les fichiers sont correctement présents dans le dépôt
4. Ajoutez des tags pour marquer la version :

```bash
git tag -a v1.0.0 -m "NekoScript version 1.0.0"
git push origin v1.0.0
```

## Publication sur npm

1. Créez un compte sur npmjs.com si ce n'est pas déjà fait
2. Connectez-vous à npm depuis votre terminal :

```bash
npm login
```

3. Utilisez le modèle `package.json.template` pour créer votre fichier package.json :

```bash
cp package.json.template package.json
```

4. Modifiez le fichier package.json pour y insérer vos informations personnelles :
   - Remplacez "votre-username" par votre nom d'utilisateur GitHub
   - Remplacez "Votre Nom" par votre nom ou pseudo

5. Vérifiez que tout est correct avec :

```bash
npm pack
```

Cette commande créera un fichier `.tgz` sans publier le package. Vous pouvez vérifier son contenu.

6. Publiez sur npm :

```bash
npm publish
```

7. Vérifiez que votre package est bien disponible sur npmjs.com

## Mise à jour du package

Pour les futures mises à jour :

1. Modifiez le code et testez les changements
2. Mettez à jour la version dans package.json :
   - Pour des corrections mineures : `1.0.1`, `1.0.2`, etc.
   - Pour des fonctionnalités nouvelles : `1.1.0`, `1.2.0`, etc.
   - Pour des changements majeurs : `2.0.0`, `3.0.0`, etc.
3. Mettez à jour le CHANGELOG.md
4. Commitez et poussez les changements sur GitHub
5. Créez un nouveau tag git pour la version
6. Publiez la nouvelle version sur npm :

```bash
npm publish
```

## Maintenance du package

- Répondez aux issues sur GitHub
- Acceptez les contributions (pull requests) selon les directives de CONTRIBUTING.md
- Mettez régulièrement à jour les dépendances
- Testez régulièrement l'installation et l'utilisation du package

## Résolution des problèmes courants

### "Cette version existe déjà sur npm"

Assurez-vous d'incrémenter la version dans package.json avant chaque publication.

### "Vous n'avez pas les droits pour publier ce package"

Vérifiez que vous êtes bien connecté avec votre compte npm et que le nom du package n'est pas déjà pris.

### "Les fichiers ne sont pas tous inclus dans le package"

Vérifiez le champ "files" dans package.json pour vous assurer que tous les répertoires et fichiers nécessaires sont listés.