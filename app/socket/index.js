const joinRoom = require('./joinRoom')

function connectSocket(io) {
  io.on('connection', (socket) => {
    joinRoom(socket);
  });
}

module.exports = connectSocket;
