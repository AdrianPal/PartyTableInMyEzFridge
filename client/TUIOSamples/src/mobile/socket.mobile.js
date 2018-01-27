import SocketManager from "../../socket.manager";

exports = module.exports = function (io, gameId, pos) {
    let prefix = 'mobile';

    SocketManager.get().emit('mobile enter game', {
        gameId: gameId,
        pos: pos
    });

    SocketManager.get().on(prefix + ' test', (result) => {
        alert('MOBILE');
    });

    SocketManager.get().on(prefix + ' trigger test', (data) => {
        alert('TEST TRIGGER ME: you can do what you want with me, ' + pos);
    });

};