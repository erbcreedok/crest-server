const generateRandomId = require('../../helpers/generateRandomId')

class Player {
  constructor(name, ip, room) {
    this.name = name;
    this.ip = ip;
    this.room = room;
    this.cards = [];
    this.state = 'idle';
    this.isReady = false;
    this.isConnected = false;
    this.id = generateRandomId(4);
    this.changeListeners = [];
    this.addChangeListener = this.addChangeListener.bind(this);
    this.emitOnChange = this.emitOnChange.bind(this);
  }
  addChangeListener(fn = f=>f) {
    this.changeListeners.push(fn);
  }
  emitOnChange() {
    this.changeListeners.forEach(fn => fn(this));
  }
  get cardsCount() {
    return this.cards.length;
  }
  get playerInfo() {
    return {
      name: this.name,
      id: this.id,
      cardsCount: this.cardsCount,
      state: this.state,
      isReady: this.isReady,
      isConnected: this.isConnected,
    }
  }
  get playerPersonalData() {
    return {...this};
  }
  setReady(data) {
    if (this.state === 'idle') {
      this.isReady = data;
      this.emitOnChange();
    } else {
      throw new Error(`Can't perform isReady change when state is not idle`);
    }
  }
  setConnected(data) {
    this.isConnected = data;
    this.emitOnChange();
  }
}

module.exports = Player;
