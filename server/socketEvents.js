exports = module.exports = function (io) {
  // Set socket.io listeners.
  io.on('connection', (socket) => {
    let username;
    console.log('a user connected');

    // On conversation entry, join broadcast channel
    socket.on('itsme', (p) => {
      username = p;
    });

    // On conversation entry, join broadcast channel
    socket.on('hello', () => {
      socket.emit('hello', 'hello to u! <3');
      console.log('joined ' + '');
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
