const DeckController =  {
  deck: require('./deck'),
  getNewDeck: function () {
    return this.shuffleDeck([...this.deck])
  },
  shuffleDeck: function(deck, method='basic') {
    if (method === 'basic') {
      return deck.sort(() => Math.floor(Math.random() * 2) - 1);
    } else {
      return this.shuffleDeck(deck);
    }
  }
};

module.exports = DeckController;
