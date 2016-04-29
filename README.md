# Backend von Car-Tracker
**Programmiersprache: PHP**
**Framework: Laravel**
**Dependencies: Composer-> handhabt Rest.**

####Dieses Projekt benötigt folgende Software:
* MySQL
* PHP5 mit PDO Extension für MySQL
* Composer (am besten global installiert via npm)

Vorausgesetzt wird eine eingestellte MySQL Datenbank also Datenbankname, Username und Password merken!

## Anleitung zur Installation

### 1. Clonen des Respositories
Mit dem Link oben rechts das Repository klonen:

```shell

mkdir myProject
cd myProject
git clone https://link-oben-rechts
```

### 2. Dependencies runterladen via Composer

```shell
composer update
```

Composer lädt alle in `composer.json` aufgelisteten Packages.

### 3. Datenbank einstellen und Daten migrieren

* Im root Verzeichnis, die Datei `.env` öffnen und Datenbankinformationen eintragen:

```
DB_HOST=127.0.0.1
DB_DATABASE=dbName
DB_USERNAME=dbUsername
DB_PASSWORD=dbPassword
```

* Danach Migrationen ausführen

```shell
php artisan migrate --seed
```
Der Befehl `--seed` füllt die Datenbank mit vordefinierten Daten die sich unter **database/seeds/** befinden. In diesem Projekt sind dass die Admin User in der Datei AdminSeeder.php

### 4. Server Starten
Den Testserver starten wir mit dem Befehl:

```shell
php artisan serve
```

### 5. Routen ändern
Da dieses Projekt auf einem Server gehostet ist, welcher auch auf dieses Repository zugreift (git pull), sind die Authentifizierungsrouten für das Frontend auch entsprechend definiert. Diese kann man unter public/js/all.js (nahe Ende der Datei) ändern.



####ACHTUNG: User Registrierung wird zurzeit nur über Mobile App erledigt.