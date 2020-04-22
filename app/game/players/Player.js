let playerIncrement = 0;

class Player {
  constructor(name) {
    this.name = name;
    this.id = ++playerIncrement;
  }
}

module.exports = Player;
