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
    
    socket.on('startPath', (p, sessionId) => {
      if(p.point.length = 3) {
        socket.broadcast.emit('startPath', p , sessionId);
      }
    })
    socket.on('continuePath', (p, sessionId) => {
      socket.broadcast.emit('continuePath', p, sessionId);
    })
    socket.on('endPath', (p, sessionId) => {
      socket.broadcast.emit('endPath', p, sessionId);
    })

    socket.on('connectionDraw', () => {
      socket.emit('connectedDraw', socket.id);
    })
  });
};
