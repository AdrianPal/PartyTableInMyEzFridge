exports = module.exports = function (io) {
    // Set socket.io listeners.

    const prefixMobile = 'mobile';
    let users = [];
    let tableId = null;

    let pictionaryDrawer  = null;

    io.on('connection', (socket) => {
        console.log('****** USER CONNECTED ******');

        let gameId;


        // On conversation entry, join broadcast channel
        socket.on('new game', (game) => {
            socket.join(game);

            users = [];

            tableId = socket.id;

            gameId = game;
        });

        socket.on('update mobile game new id', (data) => {
            socket.broadcast.emit('mobile update new game id', { gameId: data.gameId });
        });

        socket.on('mobile unuse', (data) => {
            
            console.log('----');
            console.log(users);

            for(let pos in users) {
                console.log('emiting :' + users[pos]);
                socket.to(users[pos]).emit('mobile unuse', null);
            }

            console.log('----');
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
        });

        socket.on('responseProposal', (user, response) => {
            socket.to(user._id).emit('responseProposal',response);
        });

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
