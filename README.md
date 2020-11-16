# Drupal project

Cette solution s'appuie sur [docker4drupal](https://github.com/wodby/docker4drupal).

## Installez Drupal avec composer

```
php composer.phar install
```

Si un message tel que celui-ci apparaît: PHP Fatal error:  Allowed memory size of.... utilisez la commande:

```
php -d memory_limit=-1 composer.phar install 
```

## Lancer le container Drupal

```
docker-compose up -d
```

## Ouvrez Drupal sur votre navigateur à l'adresse suivante

```
http://drupal.localhost:8000
```

## Configurez les accès à la base de données

![Alt text](install-drupal.png?raw=true "Configuration de la base de données")

## Pour installer un module ou un theme

```
php composer.phar require drupal/[modulename_or_themename]
```

## Utilisez drush

```
docker-compose exec php sh
./vendor/bin/drush
```

## Gérer le cache

### Désactiver le cache pour le développement

1. Remplacer le fichier suivant depuis la racine:

```./settings/development.services.yml => web/sites/development.services.yml```

2. Copier le fichier suivant depuis la racine:

```./settings/settings.local.php => web/sites/default/settings.local.php```

3. Retirer les commentaires à la fin du fichier ```web/sites/default/settings.php```

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
 
## Sauvegarder l'ensemble de votre projet sur un nouveau repository

1. Allez à la racine de votre projet et supprimer le dossier .git : ```rm -rf .git```
2. Connectez-vous à docker : ```docker-compose exec php sh```
3. Faite une sauvegarde de la base de données à la racine du projet : ```./vendor/bin/drush sql-dump > ./sauvegarde-db-20201116.sql```
4. Exportez les fichier de configuration : ```./vendor/bin/drush cex```
5. Sortez de docker : ```exit```
6. Sauvegarder vos fichiers média : ```tar czvf files.tar.gz htdocs/sites/default/files```
7. Créez un nouveau repository git : ```git init```
8. Ajouter l'ensemble de vos fichier : ```git add .```
9. Committez l'ensemble pour créer un nouvel historique sur votre machine : ```git commit -m "Mon projet Drupal"```
10. Allez sur votre compte GitHub.com et créer un nouveau projet (mettez simplement un nom, sans accent ni espace dans Repository name et laisser le reste par défaut)
11. Tapez les instructions indiquées dans la rubrique "…or push an existing repository from the command line", soit les 3 lignes (git remote, branch et push) sur votre terminal (toujours à la racine de votre projet)

## Tout supprimer et nettoyer

Attention! | Attention, ceci aura pour effet de détruire l'ensemble des images et container docker (y compris des autres projets).
:---: | :---

```
ssh delete-all.sh
```

Veillez également à effectuer une sauvegarde de votre base de données préalablement.

```
mkdir backup
docker-compose exec php sh
./vendor/bin/drush sql-dump > ./backup/dump-$(date +'%Y%m%d-%T').sql
exit
```

