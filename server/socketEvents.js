exports = module.exports = function (io) {
    // Set socket.io listeners.

    let picGame = [] ;
    io.on('connection', (socket) => {
        console.log('****** USER CONNECTED ******');

        // On conversation entry, join broadcast channel
        socket.on('enter game', (game) => {
            socket.join(game);
        });

        socket.on('hello::all', (m) => {
            io.sockets.emit('helloall', '[all] ' + username + ': ' + m);
            console.log('joined ' + '');
        });

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });

        socket.on('connectionPic', () => {
            console.log(picGame);
            let gameNumber = picGame.length == 0 ? 0 : picGame.length - 1;
            if(picGame[gameNumber] == null) {
                picGame[gameNumber] = socket.id;
                socket.emit('connectedPic', true);
            } else {
                socket.emit('connectedPic', false);
            }

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

        socket.on('result',(result) => {
            socket.broadcast.emit('result', result);
        })

    });
};
