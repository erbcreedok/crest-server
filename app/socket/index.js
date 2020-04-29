const joinRoom = require('./joinRoom')

function connectSocket(io) {
  io.on('connection', (socket) => {
    joinRoom(socket, io);
  });
}

module.exports = connectSocket;
