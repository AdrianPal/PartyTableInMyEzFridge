# Game view

## Hériter de Game

Si vous le souhaitez, et pour pouvoir récupérer facilement les joueurs, vous pouvez faire hériter vos jeux de la classe __`Game`__ _([Lien](../src/games/game.js))_. De ce fait, vous pourrez alors utiliser la méthode __`getPlayers()`__ pour récupérer les joueurs _(en faisant un `.done(...).fail(...)`)_.

## Revenir à la vue principale

Pour revenir à la vue principale, il suffit d'instancier la classe __`Home(_gameId)`__ avec le `gameId`.