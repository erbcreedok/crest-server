const roomService = {
  rooms: [],
  addNewRoom(room) {
    this.rooms.push(room);
  },
  findRoomById(id) {
    return this.rooms.find(r => r.id === id);
  }
}

module.exports = roomService;
