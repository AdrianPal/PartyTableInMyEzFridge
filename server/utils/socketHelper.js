const SOCKET_SAVE = require('./constants').SOCKET_SAVE; 

// ========================
// Get the socket from app
// ========================
exports.getSocket = function(req) {
    return req.app.get(SOCKET_SAVE);
}