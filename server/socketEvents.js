exports = module.exports = function (io) {
  // Set socket.io listeners.
  io.on('connection', (socket) => {
    console.log('****** USER CONNECTED ******');

    // On conversation entry, join broadcast channel
    socket.on('enter game', (game) => {
      socket.join(game);
    });

    socket.on('hello::all', (m) => {
      io.sockets.emit('helloall', '[all] ' + username + ': '+ m);
      console.log('joined ' + '');
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
};
