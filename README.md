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

## Importer et exporter la configuration de Drupal

Préalablement, modifiez la dernière ligne du fichier settings php:

```
sudo nano ./web/sites/default/settings.php
```

Et remplacer la valeur de $settings['config_sync_directory'] par $settings['config_sync_directory'] = '../config/sync';

### Pour exporter la configuration

```
docker-compose exec php sh
./vendor/bin/drush cex
exit
```

### Pour importer la configuration

```
docker-compose exec php sh
./vendor/bin/drush cim
exit
```
 

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

