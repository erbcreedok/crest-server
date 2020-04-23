const generateRandomId = require('../../helpers/generateRandomId')
const GameController = require('../GameController/GameController')

class Room {
  constructor(name) {
    this.name = name;
    this.id = generateRandomId(4);
    this.players = [];
    this.state = 'idle';
    this.changeListeners = [];
    this.game = null;
    this.addChangeListener = this.addChangeListener.bind(this);
    this.emitOnChange = this.emitOnChange.bind(this);
    this.handlePlayerChange = this.handlePlayerChange.bind(this);
  }
  addChangeListener(fn) {
    this.changeListeners.push(fn);
  }
  emitOnChange() {
    this.changeListeners.forEach(fn => fn(this));
  }
  get roomData() {
    return {
      players: this.players.map(player => player.playerInfo),
      state: this.state,
      game: this.game ? this.game.gameData : null,
    }
  }
  get isEveryoneReady() {
    return this.players.filter(p => p.isConnected).every(p => p.isReady);
  }
  addPlayer(player) {
    player.addChangeListener(this.handlePlayerChange)
    this.players.push(player);
    this.emitOnChange();
  }
  handlePlayerChange() {
    if (this.state === 'idle') {
      if (this.isEveryoneReady) {
        this.startGame();
      }
    }
    this.emitOnChange();
  }
  startGame() {
    this.state = 'starting';
    const game = new GameController(this.players);
    game.startNewGame();
    this.emitOnChange();
  }
}

module.exports = Room;
