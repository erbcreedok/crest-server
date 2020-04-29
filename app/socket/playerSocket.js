function playerSocket(socket, io, player, room) {
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
  socket.on('send card', (card) => {
    try {
      player.onMove(card);
      room.emitOnChange();
    } catch (e) {
      console.error(e);
      socket.emit('exception', e.message)
    }
  });
  socket.on('take card', () => {
    try {
      player.onTakeCard();
      room.emitOnChange();
    } catch (e) {
      console.error(e);
      socket.emit('exception', e.message)
    }
  });
  player.addChangeListener(player => {
    socket.emit('player update', player.playerPersonalData);
  });
}

module.exports = playerSocket;
