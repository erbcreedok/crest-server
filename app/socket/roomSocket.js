function roomSocket(io, room) {
  room.addChangeListener(room => {
    io.to(room.id).emit('room update', room.roomData);
  });
  room.addExceptionListener((err, room) => {
    io.to(room.id).emit('exception', err.message);
  })
}

module.exports = roomSocket;
