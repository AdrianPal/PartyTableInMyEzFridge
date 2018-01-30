const config = require('./config');

module.exports = SocketManager = (function () {
  var socket;

  function createInstance() {
    let s = io.connect(config.server);
    return s;
  }

  return {
    get: function () {
      if (!socket) {
        socket = createInstance();
      }

      return socket;
    }
  };
})();