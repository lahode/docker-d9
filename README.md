# Drupal project

Cette solution s'appuie sur [docker4drupal](https://github.com/wodby/docker4drupal).

## Pré-requis

1. Installer préalablement [Docker](https://www.docker.com) sur votre ordinateur.
2. Disposer de GIT (ou télécharger simplement le zip du projet)

## Installation

### 1. Récupérer le projet sur votre console à l'aide de GIT

```
git clone https://github.com/lahode/docker-d9.git
```

### 2. Configurer les variables d'environnement de votre projet

Cette étape est indispensable si vous souhaitez l'utiliser plus d'une fois sur votre ordinateur. Pour cela, ouvrez le fichier .env dans votre projet et modifier les valeurs suivantes:

- PROJECT_NAME
- PROJECT_BASE_URL
- PROJECT_PORT

Il est essentiel que les noms des containers (basé sur PROJECT_NAME) et que le numéro de port configuré (PROJECT_PORT) ne soit pas déjà utilisé par un autre projet. De préférence, utilisez un numéro de port supérieur à 1000 en [évitant ceux communément utilisé](https://fr.wikipedia.org/wiki/Port_(logiciel)).

### 3. Lancer le container Docker

A la racine de votre projet, lancer la commande suivante.

```
docker-compose up -d
```

La 1ère fois, cela prendra un certain temps, car Docker va télécharger l'ensemble des images nécessaires à la création de vos containers (Ceux-ci sont configurés dans le fichier docker-compose.yml)

Si vous obtenez une erreur (notamment sur Linux), il se peut que vous n'ayez pas les bons droits, utilisez donc la commande sudo.

```
sudo docker-compose up -d
```

### 4. Connectez-vous à votre docker

Pour cela connectez-vous en SSH pour aller à l'intérieur de votre docker

```
docker-compose exec php sh
```

### 5. Lancer le téléchargement de Drupal et ses dépendances avec composer

```
php composer.phar install
```

Si un message tel que celui-ci apparaît: PHP Fatal error:  Allowed memory size of.... utilisez la commande:

```
php -d memory_limit=-1 composer.phar install 
```

### 6. Droits d'accès

Durant l'étape suivante, Drupal va vouloir créer dans le dossier web/sites/default/files un dossier "files" ainsi que le fichier de configuration "settings.php". Si vous utilisez un système tel que Linux qui est très sensible au droits, créez préalablement ces 2 éléments avec un droit d'accès maximal. Vous pourrez toujours ajuster leurs droits ultérieurement, notamment settings.php qui comporte des informations d'accès à la base de données.

```
touch web/sites/default/settings.php
chmod 0777 web/sites/default/settings.php
mkdir web/sites/default/files
chmod 0777 web/sites/default/files
```

### 7. Installer Drupal via votre navigateur

1. Référez-vous aux configurations précédentes de votre fichier .env en incluant https://PROJECT_NAME:PROJECT_PORT

Par défaut, les valeurs sont:

```
http://drupal.localhost:8000
```

2. Dès lors, vous devriez accéder à l'écran d'installation de Drupal. Suivez le formulaire d'installation.

3. Lorsque vous devez insérer les accès vers la base de données, utilisez ceux indiqués dans le fichier .env: DB_NAME, DB_USER, DB_PASSWORD, DB_HOST

Par défaut, utilisez les informations suivantes:

![Alt text](install-drupal.png?raw=true "Configuration de la base de données")


## Quelques configurations utiles avant de commencer

### Créer un dossier backup à la racine

Ce dossier sera utile pour conserver vos sauvegarde de base de données et des médias.

```
mkdir backup
```

N.B. Pour information: Pour des raisons de confidentialité, il est recommandé de ne pas pousser dans le repository vos dump de base de données et autres fichiers liés à votre contenu. C'est pour cette raison que /backup a été rajouté dans le fichier .gitignore à la racine de votre projet.

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
cp ./settings/settings.local.php ./web/sites/default/settings.local.php
```

2. Retirer les commentaires (#) à la fin du fichier /web/sites/default/settings.php

```
if (file_exists($app_root . '/' . $site_path . '/settings.local.php')) {
  include $app_root . '/' . $site_path . '/settings.local.php';
}
```


## Ce qu'il faut retenir pour Docker

1. A chaque fois que vous redémarrer votre ordinateur, il vous faudra relancer docker à la racine de votre projet. Ceci est également valable si vous changer la configuration de votre docker dans le fichier .env ou docker-compose.yml

```
docker-compose up -d
```

2. Si vous avez besoin d'arrêter les containers (Ceci ne supprimera pas votre projet ou la base de données)

```
docker-compose down
```

2. Lorsque vous utilisez une commande "composer" ou "drush", il vous faut préalablement accéder à votre docker en SSH en utilisant la commande suivante:

```
docker-compose exec php sh
```

3. Pour quitter votre connexion SSH, tapez:

```
exit
```


## Utilisez composer

Composer est le gestionnaire de dépendances par défaut de PHP (comme npm l'est pour Javascript).
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
(nomdumodule ou nomdutheme est le nom que vous trouvez dans l'url après https://www.drupal.org/project/. Exemple: Pour le module (token)[https://www.drupal.org/project/token], le nomdumodule est tout simplement: token)

```
php composer.phar require drupal/[nomdumodule_ou_nomdutheme]
```

4. Désinstaller un nouveau module ou un theme de la communauté
(Attention à le désinstaller préalablement dans l'administration du site Drupal)

```
php composer.phar remove drupal/[nomdumodule_ou_nomdutheme]
```


## Utilisez drush

Drush est un des outils CLI par défaut pour Drupal. Celui-ci se trouve dans le dossier /vendor/bin de votre projet et est installé par également par composer.

```
./vendor/bin/drush
```

### Vider le cache avec Drush

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
 
## Sauvegarder l'ensemble de votre projet sur un nouveau repository GIT

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
