const generateRandomId = require('../../helpers/generateRandomId');
const GameController = require('../GameController/GameController');

class Room {
  constructor(name) {
    this.name = name;
    this.id = generateRandomId(4);
    this.players = [];
    this.state = 'idle';
    this.changeListeners = [];
    this.exceptionListeners = [];
    this.game = new GameController();
    this.startGame = this.startGame.bind(this);
    this.finishGame = this.finishGame.bind(this);
    this.addChangeListener = this.addChangeListener.bind(this);
    this.emitOnChange = this.emitOnChange.bind(this);
    this.addExceptionListener = this.addExceptionListener.bind(this);
    this.throwException = this.throwException.bind(this);
    this.handlePlayerChange = this.handlePlayerChange.bind(this);
    this.handleStartGame = this.handleStartGame.bind(this);
  }
  addExceptionListener(fn) {
    this.exceptionListeners.push(fn)
  }
  addChangeListener(fn) {
    this.changeListeners.push(fn);
  }
  throwException(err) {
    this.exceptionListeners.forEach(fn => fn(err, this));
  }
  emitOnChange() {
    this.changeListeners.forEach(fn => fn(this));
  }
  get adminId() {
    const admin = this.players.filter(p => p.isConnected)[0];
    if (admin) {
      return admin.id;
    }
  }
  get roomData() {
    return {
      players: this.players.map(player => player.playerInfo),
      state: this.state,
      game: this.game.gameData,
      adminId: this.adminId,
    }
  }
  get readyPlayers() {
    return this.players.filter(p => p.isConnected && p.isReady);
  }
  findPlayerByName(playerName) {
    return this.players.find(p => p.name === playerName)
  }
  addPlayer(player) {
    player.addChangeListener(this.handlePlayerChange);
    this.players.push(player);
    this.emitOnChange();
  }
  handlePlayerChange() {
    this.emitOnChange();
  }
  handleStartGame() {
    if (this.state === 'idle') {
      this.startGame();
    }
    this.emitOnChange();
  }
  startGame() {
    try {
      this.state = 'starting';
      this.game.startNewGame(this.readyPlayers);
      this.game.addActionListener('finish', this.finishGame);
      this.game.addActionListener('update', this.emitOnChange);
      this.state = 'started';
      this.emitOnChange();
    } catch (e) {
      this.state = 'idle';
      this.throwException(e);
    }
  }
  finishGame() {
    this.state = 'idle';
    this.players.forEach(player => player.reset());
    this.game.resetGame();
    this.emitOnChange();
  }
}

module.exports = Room;
