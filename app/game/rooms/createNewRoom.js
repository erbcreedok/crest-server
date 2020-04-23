const Room = require('./Room')
const roomService = require('./room.service')
const roomSocket = require('../../socket/roomSocket')

function createNewRoom(roomName, io) {
  const room = new Room(roomName);
  roomService.addNewRoom(room);
  roomSocket(io, room);
  return room;
}

module.exports = createNewRoom;
