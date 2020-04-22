const roomService = require('../game/rooms/room.service')
const playerService = require('../game/players/player.service')

function connectSocket(io) {
  io.on('connection', (socket) => {
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    if (!(socket.handshake.query && socket.handshake.query.room && socket.handshake.query.user)) {
      socket.emit('exception', {message: 'Please provide room and user'});
      return;
    }
    const player = playerService.findPlayerById(socket.handshake.query.user);
    const room = roomService.findRoomById(socket.handshake.query.room);
    if (!room || !player || room.id !== player.room) {
      socket.emit('exception', {message: 'Room or Player is invalid'});
      return;
    }
    socket.join(room.id);
  });
}

module.exports = connectSocket;
