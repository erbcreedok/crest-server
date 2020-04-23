function roomSocket(io, room) {
  room.addChangeListener(room => {
    io.to(room.id).emit('room update', room.roomData);
  });
}

module.exports = roomSocket;
