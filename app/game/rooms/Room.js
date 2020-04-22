const generateRandomId = require('../../helpers/generateRandomId')

class Room {
  constructor(name) {
    this.name = name;
    this.id = generateRandomId(4);
    this.players = [];
    this.state = 'idle';
  }
  addPlayer(player) {
    this.players.push(player);
  }
}

module.exports = Room;
