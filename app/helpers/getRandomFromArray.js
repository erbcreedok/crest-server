function getRandomFromArray(array) {
  return array[Math.round(Math.random() * array.length)];
}

module.exports = getRandomFromArray;
