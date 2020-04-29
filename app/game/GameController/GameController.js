const DeckController = require('../deck/DeckController')
const canBeat = require('./canBeat')

class GameController {

  constructor() {
    this.players = []
    this.moveWay = {}
    this.desk = [];
    this.state = 'idle';
    this.actionListeners = [];
    this.addActionListener = this.addActionListener.bind(this);
  }

  addActionListener(name, fn) {
    if (this.actionListeners[name]) {
      this.actionListeners.push(fn);
    } else {
      this.actionListeners[name] = [fn];
    }
  }
  emitAction(name, ...args) {
    const listeners = this.actionListeners[name];
    if (listeners) {
      listeners.forEach(fn => fn(...args));
    }
  }

  get gameData() {
    return {
      desk: this.desk,
      moveWay: this.moveWay,
      state: this.state,
      players: this.players.map(p => p.playerInfo),
    }
  }

  get lastDeskCard() {
    if (this.desk.length) {
      return this.desk[this.desk.length - 1];
    }
  }

  get activePlayers() {
    return this.players.filter(player => player.isActive);
  }

  startNewGame(players) {
    if (players.length < 2) {
      throw new Error('Min amount of players is 2');
    }
    if (players.length > 7) {
      throw new Error('Max amount of players is 7');
    }
    this.players = players;
    players.forEach((player, index) => {
      this.moveWay[player.id] = players[(index+1) % players.length].playerInfo;
      player.setState('idle');
    });
    this.distributeCards();
    this.handlePlayersMove();
    const firstPlayer = players.find(({cards}) => cards.find(card => card.id === '6d'));
    if (firstPlayer) {
      this.setActivePlayer(firstPlayer);
    } else {
      this.setActivePlayer(players[0]);
    }
    this.state = 'playing';
  }

  setNextTurn(player) {
    if (!player || !this.moveWay[player.id]) return;
    const nextPlayerId = this.moveWay[player.id].id;
    if (!nextPlayerId) return;
    const nextPlayer = this.players.find(p => p.id === nextPlayerId);
    if (nextPlayer.id === player.id) {
      return;
    }
    if (nextPlayer.state === 'win') {
      this.setNextTurn(nextPlayer);
      return;
    }
    if(nextPlayer) {
      this.setActivePlayer(nextPlayer);
    }
  }

  handlePlayersMove() {
    this.players.forEach(player => {
      player.addActionListener('onMove', (cardId) => {
        const card = player.cards.find(c => c.id === cardId);
        if (!card) return;
        if (this.lastDeskCard && !canBeat(card, this.lastDeskCard)) {
          return;
        }
        player.removeCard(card);
        this.desk.push(card);
        if (this.desk.length === this.activePlayers.length) {
          this.desk = [];
          this.handleEmptyDesk();
        } else {
          this.setNextTurn(player);
        }
      });
      player.addActionListener('onTakeCard', () => {
        if (!this.desk[0]) return;
        player.addCard(this.desk[0]);
        const c = this.desk;
        c.splice(0, 1);
        this.desk = c;
        if (this.desk.length === 0) {
          this.handleEmptyDesk();
        }
        this.setNextTurn(player);
      });
    })
  }

  handleEmptyDesk() {
    if (this.desk.length) return;
    this.activePlayers.filter(player => player.cardsCount === 0).forEach(player => {
      this.setPlayerWin(player);
    });
  }

  handleGameOver() {
    this.state = 'finish'
    this.emitAction('finish');
  }

  resetGame() {
    this.moveWay = {}
    this.players = []
    this.desk = []
    this.actionListeners = []
  }

  setPlayerWin(player) {
    const isFirst = this.players.every(player => player.state !== 'win')
    player.setWin(isFirst);
    if (this.activePlayers.length === 1) {
      this.activePlayers[0].setLose();
      this.handleGameOver();
    }
  }
  setActivePlayer(player) {
    this.activePlayers.forEach(player => player.setState('idle'))
    player.setState('turn')
    if (player.cardsCount === 0) {
      player.onTakeCard();
      this.setNextTurn(player);
    }
  }

  distributeCards() {
    const deck = DeckController.getNewDeck();
    deck.forEach((card, index) => {
      this.players[index % this.players.length].addCard(card);
    });
  }

}

module.exports = GameController;
