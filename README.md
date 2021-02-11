# Drupal project

Cette solution s'appuie sur [docker4drupal](https://github.com/wodby/docker4drupal).

-----

## Pré-requis

1. Installer préalablement [Docker](https://www.docker.com) sur votre ordinateur.
2. Disposer de GIT (ou télécharger simplement le zip du projet)

-----

## Installation

### 1. Récupérer le projet sur votre console à l'aide de GIT

```
git clone https://github.com/lahode/docker-d9.git
```

### 2. Configurer les variables d'environnement de votre projet

Cette étape est indispensable si vous souhaitez l'utiliser plus d'une fois sur votre ordinateur.

Pour cela, créer une copie du fichier **.env.example** en **.env**

```
cp .env.example .env
```

Et modifier les valeurs suivantes:

- PROJECT_NAME
- PROJECT_BASE_URL
- PROJECT_PORT

Il est essentiel que les noms des containers (basé sur **PROJECT_NAME**) et que le numéro de port configuré (**PROJECT_PORT**) ne soit pas déjà utilisés par un autre projet. De préférence, utilisez un numéro de port supérieur à 1000 en [évitant ceux communément utilisé](https://fr.wikipedia.org/wiki/Port_(logiciel)).

### 3. Lancer le container Docker

A la racine de votre projet, lancer la commande suivante.

```
docker-compose up -d
```

La 1ère fois, cela prendra un certain temps, car Docker va télécharger l'ensemble des images nécessaires à la création de vos containers (Ceux-ci sont configurés dans le fichier **docker-compose.yml**)

Si vous obtenez une erreur (notamment sur Linux), il se peut que vous n'ayez pas les bons droits, utilisez donc la commande **sudo**.

```
sudo docker-compose up -d
```

### 4. Connectez-vous à votre docker

Pour cela connectez-vous en SSH pour entrer à l'intérieur de votre docker

```
docker-compose exec php sh
```

### 5. Lancer le téléchargement de Drupal et ses dépendances avec composer

```
php composer.phar install
```

Si un message tel que celui-ci apparaît: PHP Fatal error:  Allowed memory size of.... utilisez la commande pour allouer plus de mémoire à PHP:

```
php -d memory_limit=-1 composer.phar install 
```

Une fois terminé, ressortez du docker

```
exit
```

### 6. Installer Drupal via votre navigateur

1. Référez-vous aux configurations précédentes de votre fichier **.env** en incluant ```https://PROJECT_NAME:PROJECT_PORT``` pour accéder à l'installation de Drupal sur votre navigateur.

Par défaut, les valeurs sont:

```
http://drupal.localhost:8000
```

2. Dès lors, vous devriez accéder à l'écran d'installation de Drupal en 6 étapes à commencer la langue par défaut dans laquelle vous souhaitez installer Drupal.

3. A la 2ème étape, choisissez le profil d'installation **Standard**

4. A la prochaine étape, Drupal risque de vous annoncer qu'il n'arrive pas à créer le dossier **files** dans le dossier **web/sites/default**.

![Alt text](docs/install-drupal-error-files.png?raw=true "Configuration de la base de données")

Dans ce cas, lancer les commandes suivantes pour créer le dossier files et lui attribuer les droits d'écritures complet:

```
sudo mkdir web/sites/default/files
sudo chmod 0777 web/sites/default/files
```

5. Lorsque Drupal vous demandera d'insérer les accès vers la base de données, utilisez ceux indiqués dans le fichier **.env**: **DB_NAME, DB_USER, DB_PASSWORD, DB_HOST**

Par défaut, utilisez les informations suivantes:

![Alt text](docs/install-drupal.png?raw=true "Configuration de la base de données")

Après avoir cliqué sur **Enregistrer et continuer**, il se peut que Drupal n'arrive pas à créer automatiquement le fichier **settings.php** dans lequel va figurer les informations d'accès vers la base de données que vous venez de renseigner.

![Alt text](docs/install-drupal-error-settings.png?raw=true "Configuration de la base de données")

Dans ce cas, taper les commandes suivantes pour copier le fichier d'installation d'exemple et donnez lui les droits d'écriture, le temps de l'installation

```
sudo cp web/sites/default/default.settings.php web/sites/default/settings.php
sudo chmod 0777 web/sites/default/settings.php
```

6. Continuer ensuite les étapes du formulaires en renseigner un nom d'utilisateur, un mail pour récupérer votre mot de passe, etc. jusqu'à ce que vous ayez terminé l'installation.

Si vous avez précédemment dû copier manuellement le fichier **settings.php**, remettez les droits de lecture unique pour des raisons de sécurité.

```
sudo chmod 0444 web/sites/default/settings.php
```

-----

## Quelques configurations utiles avant de commencer

### Créer un dossier backup à la racine

Ce dossier sera utile pour conserver vos sauvegarde de base de données et des médias.

```
mkdir backup
```

*N.B. Pour information: Pour des raisons de confidentialité, il est recommandé de ne pas pousser dans le repository vos dump de base de données et autres fichiers liés à votre contenu. C'est pour cette raison que /backup a été rajouté dans le fichier .gitignore à la racine de votre projet.*

### Modifier le chemin où sont stockés les fichiers de configuration

Modifiez la dernière ligne du fichier de configuration "settings.php":

```
sudo nano ./web/sites/default/settings.php
```

Et remplacer la valeur de ```$settings['config_sync_directory']``` par ```$settings['config_sync_directory'] = '../config/sync';```

### Désactiver le cache pour le développement

1. Copier les fichiers suivants depuis la racine vers les dossiers suivants:

```
cp ./settings/dev.services.yml ./web/sites/dev.services.yml
```

```
sudo cp ./settings/settings.local.php ./web/sites/default/settings.local.php
```

2. Retirer les commentaires (#) à la fin du fichier /web/sites/default/settings.php

```
if (file_exists($app_root . '/' . $site_path . '/settings.local.php')) {
  include $app_root . '/' . $site_path . '/settings.local.php';
}
```

-----

## Ce qu'il faut retenir pour Docker

1. A chaque fois que vous redémarrez votre ordinateur, il vous faudra relancer docker à la racine de votre projet. Ceci est également valable si vous changer la configuration de votre docker dans le fichier **.env** ou **docker-compose.yml**

```
docker-compose up -d
```

2. Si vous avez besoin d'arrêter les containers (Ceci ne supprimera pas votre projet ou la base de données)

```
docker-compose down
```

2. Lorsque vous utilisez une commande "**composer**" ou "**drush**", il vous faut préalablement accéder à votre docker en SSH en utilisant la commande suivante:

```
docker-compose exec php sh
```

3. Pour quitter votre connexion SSH, tapez:

```
exit
```

-----

## Utilisez composer

Composer est le gestionnaire de dépendances par défaut de PHP (comme **npm** l'est pour Javascript).
On l'utilise pour Drupal, notamment pour:

1. Installer Drupal

```
php composer.phar install
```

2. Mettre à jour Drupal

```
php composer.phar update
```

3. Installer un nouveau module ou un theme de la communauté

(nomdumodule ou nomdutheme est le nom que vous trouvez dans l'url après https://www.drupal.org/project/. 

Exemple: Pour le module (token)[https://www.drupal.org/project/token], le nomdumodule est tout simplement: token)

```
php composer.phar require drupal/[nomdumodule_ou_nomdutheme]
```

4. Désinstaller un nouveau module ou un theme de la communauté
(Attention à le désinstaller préalablement dans l'administration du site Drupal)

```
php composer.phar remove drupal/[nomdumodule_ou_nomdutheme]
```

-----

## Utilisez drush

Drush est un des outils CLI par défaut pour Drupal. Celui-ci est installé par **composer** et se trouve dans le dossier **/vendor/bin** de votre projet.

```
./vendor/bin/drush
```

### Vider le cache de Drupal avec Drush

Cette opération est à réaliser fréquemment. Même si vous avez désactivé le cache pour le développement (voir plus haut), il y a parfois des éléments qui reste dans le cache. Par exemple, lorsque vous modifiez un fichier **.yml**, il est obligatoire de vider le cache pour que celui-ci soit pris en compte.

```
./vendor/bin/drush cr
```

### Exporter la configuration

```
./vendor/bin/drush cex
```

### Importer la configuration

```
./vendor/bin/drush cim
```

### Sauvegarder votre base de donnée vers un fichier SQL

```
./vendor/bin/drush sql-dump > ./backup/nom_fichier.sql
```

### Restaurer votre base données à partir d'un fichier SQL

```
./vendor/bin/drush sql-cli < ./backup/nom_fichier.sql
```

### Vider votre base données

Bonne pratique à réaliser avant de restaurer votre base de donnée

```
./vendor/bin/drush sql-drop
```

### Accéder à votre site en super admin

Bonne pratique si vous avez oublié votre mot de passe

```
./vendor/bin/drush uli
```

-----

## Préparer l'ensemble de votre projet pour un nouveau repository GIT

1. Allez à la racine de votre projet et supprimer le dossier .git : ```rm -rf .git```
2. Connectez-vous à docker : ```docker-compose exec php sh```
3. Faite une sauvegarde de la base de données à la racine du projet : ```./vendor/bin/drush sql-dump > ./sauvegarde-db-20201116.sql```
4. Exportez les fichier de configuration : ```./vendor/bin/drush cex```
5. Sortez de docker : ```exit```
6. Sauvegarder vos fichiers média : ```tar czvf files.tar.gz web/sites/default/files```
7. Créez un nouveau repository git : ```git init```
8. Ajouter l'ensemble de vos fichier : ```git add .```
9. Committez l'ensemble pour créer un nouvel historique sur votre machine : ```git commit -m "Mon projet Drupal"```
10. Allez sur votre compte GitHub.com et créer un nouveau projet (mettez simplement un nom, sans accent ni espace dans Repository name et laisser le reste par défaut)
11. Tapez les instructions indiquées dans la rubrique "…or push an existing repository from the command line", soit les 3 lignes (git remote, branch et push) sur votre terminal (toujours à la racine de votre projet)

-----

## Utiliser SCSS dans votre thème

Cette procédure vous permet de compiler et minifier les fichiers **SCSS** et **JS** de votre thème suivants:
- assets/scss/style.scss => build/css/style.css
- assets/js/script.js => build/js/script.js

### Préparer votre thème

Avant de procéder à la suite, voici comment devrait se présenter la structure de vos assets (fichiers SCSS, JS, images et polices)

- montheme
  - assets
    - fonts
    - images
    - js
      - script.js
    - scss
      - style.scss

### Installer NVM

Si le thème que vous utilisez ne possède pas de compilateur SCSS, procédez comme suit.

Au préalable, vérifiez avant tout si **npm** est déjà installé en tapant ```npm -v```. Sinon rendez-vous sur la [page d'installation nvm](https://github.com/nvm-sh/nvm) pour installer une version de [nodejs](https://nodejs.org). Je recommenderai la version LTS de NodeJS.
Exemple: Pour installer la version 14 de nodejs une fois installé:

```
nvm install v14
```

### Installer les dépendances et configurez le chemin de votre thème

Installer ensuite toutes les dépendances définies dans package.json:

```
npm i
```

Modifiez ensuite la valeur ```PROJECT_THEMEPATH=web/themes/custom/mytheme``` dans le fichier .env par le chemin relatif où se situe votre thème. 

### Lancer le compilateur 

Si vous travaillez êtes sur votre environnement de développement et que vous souhaitez le fonction "Hot Reload" (recompile à chaque fois qu'un fichier est modifié et rafraîchi votre site sur une adresse de type localhost:3000):

```
npm run dev
```

Si vous souhaitez compiler pour la production, afin d'optimisez vos fichiers JS et CSS

```
npm run prod
```

### Comment faire si je veux compiler d'autres fichiers SCSS ou JS ?

Allez à la ligne 38 dans le fichier **webpack.mix.js** à la racine de votre projet et ajoutez:

Pour un fichier JS:

```
.js(process.env.PROJECT_THEMEPATH + '/assets/js/autrefichier.js', 'js')
```

Pour un fichier SCSS:

```
.sass(process.env.PROJECT_THEMEPATH + '/assets/scss/autrefichier.scss', 'css')
```

-----

## Tout supprimer et nettoyer

Attention! | Attention, ceci aura pour effet de détruire l'ensemble des containers docker liés à ce projet et donc de supprimer les données contenus dans la base de données.
:---: | :---

Il est donc préalablement recommandé d'effectuer une sauvegarde de votre base de données:

```
mkdir backup
docker-compose exec php sh
./vendor/bin/drush sql-dump > ./backup/dump-$(date +'%Y%m%d-%T').sql
exit
```

Pour supprimer les containers, exécuter la commande suivante:

```
ssh delete-all.sh
```

N.B: Cela ne supprimera pas les images téléchargées la première fois, car il se peut que celle-ci soit utilisées par un autre projet. Si toutefois vous souhaitez supprimer l'ensemble des containers et des images dans le but de nettoyer votre ordinateur, référez à la [documentation suivante](https://docs.tibco.com/pub/mash-local/4.1.1/doc/html/docker/GUID-BD850566-5B79-4915-987E-430FC38DAAE4.html).
