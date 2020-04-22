const generateRandomId = require('../../helpers/generateRandomId')

class Player {
  constructor(name, ip, room) {
    this.name = name;
    this.ip = ip;
    this.room = room;
    this.id = generateRandomId(4);
  }
}

module.exports = Player;
