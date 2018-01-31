exports = module.exports = function (io) {
    // Set socket.io listeners.

    const prefixMobile = 'mobile';

    io.on('connection', (socket) => {
        console.log('****** USER CONNECTED ******');

        let gameId;
        let users = [];


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
            console.log(users);
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
        

        /****************************************** PICTIONARY **********************************************/
        socket.on('isDrawing', (east, north, drag, color, drawSize) => {
            socket.broadcast.emit('isDrawing', east, north, drag, color, drawSize);
        });

        socket.on('wordInitialized', (word) => {
            socket.broadcast.emit('wordInitialized', word);
        })


        socket.on('clearCanvas', () => {
            socket.broadcast.emit('clearCanvas');
        })


        socket.on('mobile enter pictionary game',() => {
            var randomPlayer = Math.random(users.length - 1);
            for(let i = 0; i < users.length; i++) {
                if (i == randomPlayer){
                    socket.to(users[randomPlayer]).emit('mobile game pictionary', true);
                    console.log(1);
                } else {
                    socket.to(users[randomPlayer]).emit('mobile game pictionary', false);
                    console.log(2);
                }
            }
        })

        //------------------------------------BALLS--------------------------

    });
};
