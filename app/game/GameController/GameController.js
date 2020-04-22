const DeckController = require('../deck/DeckController')




class GameController {

  constructor(players) {
    this.players = players
    this.playersState = players.map(player => ({player, cards: [], status: 'idle'}))
    this.moveWay = {}
    this.desk = [];
    this.gameStatus = 'idle';
    players.forEach((player, index) => {
      this.moveWay[player.id] = players[index % players.length];
    });
  }

  get lastDeskCard() {
    if (this.desk.length) {
      return this.desk[this.desk.length - 1];
    }
  }

  get generalData() {
    return {
      playerStats: this.playersState.map(p => ({
        name: p.player.name,
        cardCount: p.cards.length,
        status: p.status,
      })),
      desk: this.desk,
    };
  }

  startNewGame() {
    if (this.players.length < 2) {
      throw new Error('Min amount of players is 2');
    }
    if (this.players.length > 7) {
      throw new Error('Max amount of players is 7');
    }
    this.distributeCards();
    const firstPlayerIndex = this.playersState.findIndex(player => player.cards.find(card => card.id === '6d'));
    if (firstPlayerIndex !== -1) {
      this.setActivePlayer(firstPlayerIndex);
      this.gameStatus = 'playing';
    }
  }

  setActivePlayer(playerIndex) {
    this.activePlayer = this.playersState[playerIndex].player
    this.playersState = this.playersState.map(p => ({...p, status: 'idle'}));
    this.playersState[playerIndex].status = 'turn'
    this.activePlayer.onMove = this.handlePlayerMove(this.playersState[playerIndex]);
  }

  handlePlayerMove(playerState) {
    return card => {
      const index = playerState.cards.findIndex(c => c.id === card.id);
    }
  }

  getPlayerInfo(playerId) {
    const playerState = this.playersState.find(ps => ps.player.id === playerId);
    if (!playerState) {
      throw new Error(`Player with id ${playerId} doesn't exist`);
    }
    return {
      ...playerState,
      cards: playerState.cards.map(c => c.id),
    }
  }

  getGameStats(playerId) {
    if (!playerId) {
      return this.generalData;
    }
    return {
      ...this.generalData,
      playerInfo: this.getPlayerInfo(playerId),
    }
  }

  distributeCards() {
    const deck = DeckController.getNewDeck();
    deck.forEach((card, index) => {
      this.playersState[index % this.playersState.length].cards.push(card);
    });
  }

}

module.exports = GameController;
