# PartyTableInMyEzFridge
Polytech SI5 Project

## Team

Adrian Palumbo
Thomas Gillot
Arnaud Zago
Rémy Kaloustian

## Instructions pour installer
1) cloner ce repo
2) Installer MongoDB express (si ce n'est déjà fait)
3) Dans client/TUIOManager, lancer npm link
4) Dans client/TUIOSamples, lancer npm link tuiomanager
5)Dans client/TUIOManager, client/TUIOSamples et client/TUIOClient, lancer npm install
6) Dans server/scripts, lancer sur deux consoles différentes
sh start_db.sh
sh start_server.sh
7) Dans client/TUIOSamples, ouvrir config.js et le modifier de la sorte : 

```
module.exports = {
    // API Server
    server: 'http://[votre adresse ip]:4000',
    // Current IP
    ip: '[votre adresse ip]',
    // Current Port
    port: 3000,
};
```


8) Dans client/ lancer launch.bat
9) Dans votre navigateur, aller sur [votre adresse ip]:3000
10) Have fun


