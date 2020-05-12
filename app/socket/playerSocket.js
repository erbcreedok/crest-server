function playerSocket(socket, io, player, room) {
  socket.on('start room game', () => {
    if (room.adminId === player.id) {
      room.handleStartGame();
    } else {
      socket.emit('exception', 'Only room admin can start game');
    }
  });
  socket.on('finish game', () => {
    if (room.adminId === player.id) {
      room.finishGame();
    } else {
      socket.emit('exception', 'Only room admin can restart game');
    }
  });
  socket.on('change avatar', (emoji, fn) => {
    if (!player.isReady) {
      player.setEmoji(emoji);
      fn(player.playerPersonalData)
    } else {
      socket.emit('exception', `You can't change avatar when ready`);
    }
  });
  socket.on('emote', (emoji) => {
    if (player.isReady) {
      io.to(room.id).emit('emote', player.id, emoji);
    } else {
      socket.emit('exception', `You can't send emotions when not ready`);
    }
  });
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
