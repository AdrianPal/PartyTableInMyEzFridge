import SocketManager from "../../socket.manager";
import PictionaryMobile from "../games/pictionary/mobile/pictionary.mobile";
import launchLabyrinth from "../games/labyrinth";

exports = module.exports = function (io, gameId, pos) {
    let prefix = 'mobile';

    SocketManager.get().emit(prefix +' enter game', {
        gameId: gameId,
        pos: pos
    });

    SocketManager.get().on(prefix + ' test', (result) => {
        alert('MOBILE');
    });

    SocketManager.get().on(prefix + ' trigger test', (data) => {
        alert('TEST TRIGGER ME: you can do what you want with me, ' + pos);
    });

    SocketManager.get().on(prefix + ' game pictionary', (isChoosenMobile, word) => {
        new PictionaryMobile(gameId, pos, isChoosenMobile, word);
    })

    SocketManager.get().on(prefix + ' launch labyrinth', () => {
        launchLabyrinth(gameId);
    })

};