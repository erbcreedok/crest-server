const suits = require('./suits');
const cardValues = ['ace', 'king', 'queen', 'jack', '10', '9', '8', '7', '6'];
const deck = []

const Card = function(value, suit) {
  this.value = value
  this.suit = suit
  this.id = value.slice(0, 1) + suit.name.slice(0,1)
};

suits.forEach(suit => {
  cardValues.forEach( cardValue => {
    deck.push(new Card(cardValue, suit));
  })
})

module.exports = deck;
