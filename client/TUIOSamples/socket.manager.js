module.exports = SocketManager = (function () {
  var socket;

  function createInstance() {
    let s = io.connect('http://' + IP + ':4000');
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