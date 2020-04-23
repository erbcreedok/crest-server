const DeckController = require('../deck/DeckController')

class GameController {

  constructor(players) {
    this.players = players
    this.moveWay = {}
    this.desk = [];
    this.state = 'idle';
    players.forEach((player, index) => {
      this.moveWay[player.id] = players[index % players.length].playerInfo;
    });
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

  startNewGame() {
    if (this.players.length < 2) {
      throw new Error('Min amount of players is 2');
    }
    if (this.players.length > 7) {
      throw new Error('Max amount of players is 7');
    }
    this.distributeCards();
    const firstPlayerIndex = this.players.findIndex(({cards}) => cards.find(card => card.id === '6d'));
    if (firstPlayerIndex !== -1) {
      this.setActivePlayer(firstPlayerIndex);
      this.state = 'playing';
    }
  }

  setActivePlayer(playerIndex) {
    this.players.forEach(player => player.state = 'idle')
    this.players[playerIndex].state = 'turn'
  }

  distributeCards() {
    const deck = DeckController.getNewDeck();
    deck.forEach((card, index) => {
      this.players[index % this.players.length].cards.push(card);
    });
  }

}

module.exports = GameController;
