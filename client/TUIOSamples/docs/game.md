# Game view

## Hériter de Game

Si vous le souhaitez, et pour pouvoir récupérer facilement les joueurs, vous pouvez faire hériter vos jeux de la classe __[Game](../src/games/game.js)__. De ce fait, vous pourrez alors utiliser la méthode __`getPlayers()`__ pour récupérer les joueurs _(en faisant un `.done(...).fail(...)`)_.

## Utiliser le "Cliquez n'importe où pour..."

Vous pouvez instancier un objet de type __[Anywhere](../src/tools/anywhere.js)__ et l'utiliser avec un callback pour récupérer le clic. Un exemple est donné ci-dessous :

```js
let anywhere = new Anywhere(this, _callBack);
anywhere.addTo($('body').get(0));
```

Lors du clic, le `callBack` sera appelé avec comme paramètre le widget `Anywhere` lui même. Ainsi, vous pourrez faire `widget.deleteWidget()` pour le supprimer.

## Mettre à jour le nombre de points

Pour mettre à jour le nombre de points d'un utilisateur, il faut faire une requete __PUT__ sur l'URL `/api/user/points` avec l'ID de l'utilisateur en paramètre et le nombre de points __à ajouter__ :

```js
$.ajax({
    url: config.server + '/api/user/points',
    type: 'PUT',
    data: {
        userId: currentUser._id,
        points: 5
    }
});
```

Concernant l'ajout des points, définissons une convention : __5 points__ pour le/les gagnants, et 2 points à ceux qui ont aidé à la victoire.

## Revenir à la vue principale

Pour revenir à la vue principale, il suffit d'instancier la classe __`Home(_gameId)`__ avec le `gameId`.