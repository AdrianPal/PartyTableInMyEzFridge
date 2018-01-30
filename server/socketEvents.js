exports = module.exports = function (io) {
    // Set socket.io listeners.

    let idTable;
    let picPlayersId = [];

    const prefixMobile = 'mobile';

    let users = [];
    io.on('connection', (socket) => {
        console.log('****** USER CONNECTED ******');

        let gameId;

        // On conversation entry, join broadcast channel
        socket.on('new game', (game) => {
            socket.join(game);

            users = [];

            gameId = game;
        });

        // On conversation entry for mobile
        socket.on(prefixMobile + ' enter game', (data) => {
            socket.join('mobile ' + data.gameId);

            gameId = data.gameId;

            users[data.pos] = socket.id;
        });

        socket.on(prefixMobile + ' trigger', (data) => {
            let pos = data.pos;

            if (users[pos] !== undefined)
                socket.to(users[pos]).emit('mobile trigger test', null);
        });

        socket.on('hello::all', (m) => {
            io.sockets.emit('helloall', '[all] ' + username + ': ' + m);
        });

        socket.on('disconnect', () => {
            socket.leave(gameId);
        });

        socket.on('wordInitialized', (word) => {
            socket.broadcast.emit('wordInitialized', word);
        })
        socket.on('beginDraw', (east, north, drag) => {
            socket.broadcast.emit('beginDraw', east, north, drag);
        });

        socket.on('isDrawing', (east, north, drag, color, drawSize) => {
            socket.broadcast.emit('isDrawing', east, north, drag, color, drawSize);
        });

        socket.on('finishedDraw', (east, north, drag) => {
            socket.broadcast.emit('finishedDraw', east, north, drag);
        });

        socket.on('clearCanvas', () => {
            socket.broadcast.emit('clearCanvas');
        })

        /****************************************** MAZE **********************************************/
        socket.on('mazeConnection', () => {
            socket.emit('mazeConnection');
        });

        socket.on('arrayToResolve', (array) => {
            socket.broadcast.emit('arrayToResolve', array);
        });

        socket.on('result', (result) => {
            socket.broadcast.emit('result', result);
        })
        

        //------------------------------------BALLS--------------------------

    });
};
