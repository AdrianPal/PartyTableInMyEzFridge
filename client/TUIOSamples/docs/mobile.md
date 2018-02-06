# Utilisation du mobile

## "Routing"

Au début du jeu, l'utilisateur va utiliser son smartphone pour lire un QRCode et définir "qui il est". 
Cette étape va le lier au jeu ; le lier lui, et lier son mobile.

Le QRCode va pointer vers `./?view=mobile&...`, et c'est dans le fichier [index.js](../src/index.js) que la partie "routing" va se faire :

```js
$(window).ready(() => {
  if (getUrlParameter('view') === 'mobile' &&
    getUrlParameter('gameId') != undefined && getUrlParameter('gameId') != null &&
    getUrlParameter('pos') != undefined && getUrlParameter('pos') != null) {

    let gameId = getUrlParameter('gameId'),
      pos = getUrlParameter('pos');

    new MobileLogin(gameId, pos);

    SocketMobile(io, gameId, pos);
  } else {
    new Home;
  }
});
```
Dans ce fichier, on va regarder dans l'URL si le paramètre __view__ est présent _- à l'aide de la fonction `getUrlParameter('view')` -_ et vérifier s'il est égal à __mobile__.

En plus de ce paramètre, deux autres sont nécessaires :
- __gameId__, qui correspond à l'ID du game courant
- __pos__, qui va permettre de savoir "où se trouve ce joueur" : left, right, top, bottom.

Suite à cela, on appellera dans un premier temps la vue `MobileLogin` et déclarer des écouteurs de socket avec `SocketMobile`.

### MobileLogin

`MobileLogin` va déterminer si le joueur pour cette position s'est déjà enregistré, auquel cas il le reconnaitra, ou si cette position est "nouvelle" pour la partie en cours _(gameId)_.

### SocketMobile
`SocketMobile` va permettre de déclencher la mise à jour de la vue mobile en fonction du jeu en cours. Dans le fichier [socket.mobile.js](../src/mobile/socket.mobile.js), on va retrouver deux parties :

La première concerne la Socket émise au début, qui va permettre d'associer sur le serveur une socket à une position précise/un smartphone précis :

```js
SocketManager.get().emit('mobile enter game', {
  gameId: gameId,
  pos: pos
});
```

La seconde partie est pour la gestion de l'affichage mobile. On va donc retrouver des écouteurs de Socket, qui vont déclencher les bonnes vues :

```js
Exemple:

SocketManager.get().on('mobile game labyrinth', (d) => {
  new MobileLabyrinth();
});
```

Ici, l'idéal est que __MobileLabyrinth__ hérite de la classe [MobileHandler](../src/mobile/mobile.handler.js) pour récupérer ses attributs et fonctions, à la manière de [MobileLogin](../src/mobile/login/mobile.login.js).

### S'assurer que la vue sur le smartphone soit toujours synchro

Si l'utilisateur recharge la page sur son mobile, on veut qu'il revienne sur la bonne vue.

Pour ce faire, il suffit de sauvegarder lors du transit par le serveur la socket associée à la vue courante sur le mobile, dans la variable `currentSocketMobileDisplay`. 
Ainsi, lorsqu'un nouveau smartphone entre dans la partie, on va vérifier si la variable `currentSocketMobileDisplay` est différente de nulle. Si c'est le cas, on enverra la socket `currentSocketMobileDisplay`.

Un exemple concernant le Twister est donné. Pour ce jeu, on affiche les règles sur le smartphone. Lorsque la table notifie le serveur de mettre à jour les vues mobiles, on sauvegarde la socket _"règles du twister"_ :

```js
socket.on(prefixMobile + ' twister rules', (data) => {
  let emit = prefixMobile + ' game twister rules';

  for(let pos in users) {
    socket.to(users[pos]).emit(emit, null);
  }

  // On sauvegarde
  currentSocketMobileDisplay = emit;
});
```

Et lorsqu'un samrtphone se connecte au serveur, on effectue la vérification suivante :

```js
socket.on(prefixMobile + ' enter game', (data) => {
  [...]

  // Used if the user reload its mobile
  if (currentSocketMobileDisplay !== null) {
    socket.emit(currentSocketMobileDisplay);
  }
});
```

## Communiquer avec un smartphone précis

Pour communiquer avec un smartphone précis, c'est à dire avec une __position précise__ en fait (chaque smartphone représentant une position sur le jeu : top, bottom, left, right), un exemple est fourni sur la partie serveur.

Pour faire simple, chaque smartphone est enregistré avec sa position, et il suffit que la vue principale envoie une requete au serveur avec la position visée _(mettons qu'on veuille communiquer avec __bottom__)_, et le serveur pourra rediriger la requete comme ceci :

```js
Code coté serveur:

socket.on('mobile labyrinth trigger position', (data) => {
  let pos = data.pos;

  if (users[pos] !== undefined)
    socket.to(users[pos]).emit('mobile game labyrinth', null);
});
```
Grâce à cela, seul le smartphone à la position voulue sera déclenché !
