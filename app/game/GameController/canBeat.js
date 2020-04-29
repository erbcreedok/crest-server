const beatOrder = ['6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace',];

function canBeat(beatingCard, defendingCard) {
  if (beatingCard.suit.name === defendingCard.suit.name) {
    return (beatOrder.indexOf(beatingCard.value) > beatOrder.indexOf(defendingCard.value));
  }
  return beatingCard.suit.name === 'diamonds' && !['diamonds', 'clubs'].includes(defendingCard.suit.name);
}

module.exports = canBeat;
