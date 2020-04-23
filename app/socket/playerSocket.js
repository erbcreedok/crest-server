function playerSocket(socket, player, room) {
  socket.on('get room data', (fn) => {
    fn(room.roomData);
  });
  socket.on('get player data', (fn) => {
    fn(player.playerPersonalData);
  });
  socket.on('set player ready state', (data, fn) => {
    player.setReady(data);
    fn(player.playerPersonalData);
  });
  player.addChangeListener(player => {
    socket.emit('player changed', player.playerPersonalData);
  });
}

module.exports = playerSocket;
