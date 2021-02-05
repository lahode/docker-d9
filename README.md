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

Il est essentiel que les noms des containers (basé sur PROJECT_NAME) et que le numéro de port configuré (PROJECT_PORT) ne soit pas déjà utilisé par un autre projet. De préférence, utilisez un numéro de port supérieur à 1000 en [évitant ceux communément utilisé](https://fr.wikipedia.org/wiki/Port_(logiciel)#:~:text=les%20num%C3%A9ros%20de%20port%20de,)%2C%20assign%C3%A9s%20par%20l'IANA).

### 3. Lancer le container Docker

```
docker-compose up -d
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

### 6. Installer Drupal via votre navigateur

1. Référez-vous aux configurations précédentes de votre fichier .env en incluant https://PROJECT_NAME:PROJECT_PORT

Par défaut, les valeurs sont:

```
http://drupal.localhost:8000
```

2. Dès lors vous devriez accéder à l'écran d'installation de Drupal. Suivez le formulaire d'installation.

3. Lorsque vous devez insérer les accès vers la base de données, utilisez ceux indiquer dans le fichier .env: DB_NAME, DB_USER, DB_PASSWORD, DB_HOST

Par défaut, utilisez les informations suivantes:

![Alt text](install-drupal.png?raw=true "Configuration de la base de données")


## Ce qu'il faut retenir pour Docker

Lorsque vous utilisez une commande "composer" ou "drush", il vous faut préalablement accéder à votre docker en SSH en utilisant la commande suivante:

```
docker-compose exec php sh
```

Pour quitter votre connexion SSH, tapez:

```
exit
```

## Installation d'un un module ou un theme avec composer

```
php composer.phar require drupal/[modulename_or_themename]
```

## Utilisez drush

```
./vendor/bin/drush
```

## Gérer le cache

### Désactiver le cache pour le développement

1. Copier les fichiers suivants depuis la racine vers les dossiers suivants:

```./settings/dev.services.yml => ./web/sites/dev.services.yml```

```./settings/settings.local.php => ./web/sites/default/settings.local.php```

2. Retirer les commentaires (#) à la fin du fichier /web/sites/default/settings.php

```
if (file_exists($app_root . '/' . $site_path . '/settings.local.php')) {
  include $app_root . '/' . $site_path . '/settings.local.php';
}
```

### Vider le cache avec Drush

```
./vendor/bin/drush cr
```

## Importer et exporter la configuration de Drupal

Préalablement, modifiez la dernière ligne du fichier settings.php:

```
sudo nano ./web/sites/default/settings.php
```

Et remplacer la valeur de ```$settings['config_sync_directory']``` par ```$settings['config_sync_directory'] = '../config/sync';```

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

Attention! | Attention, ceci aura pour effet de détruire l'ensemble des images et container docker (y compris des autres projets). Utilisez ce script en dernier recours!!!
:---: | :---

```
ssh delete-all.sh
```

Veillez également à effectuer une sauvegarde de votre base de données préalablement, sinon tout votre projet sera perdu.

```
mkdir backup
docker-compose exec php sh
./vendor/bin/drush sql-dump > ./backup/dump-$(date +'%Y%m%d-%T').sql
exit
```
