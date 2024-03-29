# User view

## Instancier la vue

Pour afficher la vue des joueurs, et de manière à ce qu'elle soit la même quelque soit le jeu, vous pouvez instancier la classe __[User](../src/user/user.js)__ avec deux paramètres :

* __elements__, la liste d'élements à afficher, qui peut etre :
    * La liste des QRCode à afficher, avec la clef __pos__ ;
    * La liste des utilisateurs, aussi avec la clef __pos__.
* __gameId__, l'ID de la partie en cours.

Pour mettre à jour les éléments, vous pouvez utilisater la méthode __`updateElements(newElements)`__.

La liste des utilisateurs peut etre retrouvée sur l'API à l'adresse `api/user/{gameId}`.

Un exemple d'utilisation de cette classe se trouve dans la classe __[Home](../src/home/home.js)__.

## Enlever la vue

Pour enlever la vue des joueurs, vous pouvez appeler la méthode statique de la classe User : __`User.remove()`__.