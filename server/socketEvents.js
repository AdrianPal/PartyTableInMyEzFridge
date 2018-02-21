exports = module.exports = function (io) {
    // Set socket.io listeners.

    const prefixMobile = 'mobile';
    let users = [];
    let tableId = null;

    let pictionaryDrawer  = null;

    let currentSocketMobileDisplay = null;

    io.on('connection', (socket) => {
        console.log('****** USER CONNECTED ******');

        let gameId;


        // On conversation entry, join broadcast channel
        socket.on('new game', (game) => {
            socket.join(game);

            users = [];

            currentSocketMobileDisplay = null;

            tableId = socket.id;

            gameId = game;

            tableId = socket.id;
        });

        socket.on('update mobile game new id', (data) => {
            socket.broadcast.emit('mobile update new game id', { gameId: data.gameId });
        });

        socket.on(prefixMobile + ' twister rules', (data) => {
            let emit = prefixMobile + ' game twister rules';

            for(let pos in users) {
                socket.to(users[pos]).emit(emit, null);
            }

            currentSocketMobileDisplay = emit;
        });

        socket.on(prefixMobile + ' unuse', (data) => {

            console.log('----');
            console.log('MOBILE UNUSE');
            
            for(let pos in users) {
                console.log('emitting: '+ pos);
                socket.to(users[pos]).emit('mobile unuse', null);
            }
            console.log('----');

            currentSocketMobileDisplay = null;
        });

        // On conversation entry for mobile
        socket.on(prefixMobile + ' enter game', (data) => {
            socket.join('mobile ' + data.gameId);

            gameId = data.gameId;

            users[data.pos] = socket.id;

            // Used if the user reload its mobile
            if (currentSocketMobileDisplay !== null) {
                socket.emit(currentSocketMobileDisplay);
            }

            socket.broadcast.emit('hide QRCode', { pos: data.pos });
            console.log('EMITTING HIDE QRCODE');
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
            socket.to(tableId).emit('mazeConnection',JSON.parse(JSON.stringify(users)));
        });

        socket.on('arrayToResolve', (array, user) => {
            socket.to(tableId).emit('arrayToResolve', array, user);
        });

        socket.on('result', (result, data) => {
            console.log(data);
            socket.to(users[data.user.pos]).emit('result', result, data);
        });

        socket.on('isReady',() => {
           socket.to(tableId).emit('isReady',socket.id);
        });

        socket.on('startLabyrinth',() => {
            socket.broadcast.emit('startLabyrinth');
        });
        socket.on('mobile launch labyrinth',() => {
            socket.broadcast.emit('mobile launch labyrinth');
        });
        socket.on('timeUp', () => {
           socket.broadcast.emit('timeUp');
        });

        socket.on('maze reset', () => {
            socket.broadcast.emit('maze reset');
        });

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
            var usersSize = Object.keys(users).length;
            var randomPlayer = Math.floor(Math.random() * Math.floor(usersSize));


            const possibleWord = ['CAT', 'DOG', 'PLATE', 'SPOON', 'KNIFE', 'FORK', 'COW', 'CUCUMBER', 'STAIRS', 'PLANET', 'EMPIRE STATE BUILDING', 'BRIDGE', 'GREEN'];
            const randomWord  = Math.floor(Math.random() * (possibleWord.length) + 0);
    

            var userIndex = 0;
            for(let userPos in users) {
                if (userIndex == randomPlayer){
                    pictionaryDrawer = users[userPos];
                    socket.to(users[userPos]).emit('mobile game pictionary', true, possibleWord[randomWord]);
                } else {
                    socket.to(users[userPos]).emit('mobile game pictionary', false, null);
                }
                userIndex++;
            }
        })

        socket.on('startPic', () => {
            socket.broadcast.emit('startPic');
        });

        socket.on('decreaseCountdown', (value) => {
            socket.broadcast.emit('decreaseCountdown', value, gameId);
        });

        socket.on('proposeWord', (word, user) => {
            socket.to(pictionaryDrawer).emit('proposal', word, user);
            socket.to(tableId).emit('proposal', word, user);
        });

        socket.on('responseProposal', (user, response) => {
            socket.to(user._id).emit('responseProposal',response);
        });

        socket.on('decline', () => {
            socket.to(tableId).emit('decline');
        })

        socket.on('endGame', (winner) => {
            for(let userPos in users) {
                if(users[userPos] == pictionaryDrawer){
                    socket.to(tableId).emit('pictionaryEnd', userPos, winner, gameId);
                }
            }
        });

        //------------------------------------BALLS--------------------------

    });
};
