const generateRandomId = require('../../helpers/generateRandomId')

class Player {
  constructor(name, ip, room) {
    this.name = name;
    this.ip = ip;
    this.room = room;
    this.cards = [];
    this.state = 'wait';
    this.isReady = false;
    this.isConnected = false;
    this.id = generateRandomId(4);
    this.changeListeners = [];
    this.actionListeners = {};
    this.firstWinCount = 0;
    this.loseCount = 0;
    this.addChangeListener = this.addChangeListener.bind(this);
    this.addActionListener = this.addActionListener.bind(this);
    this.emitOnChange = this.emitOnChange.bind(this);
    this.emitAction = this.emitAction.bind(this);
  }
  addChangeListener(fn = f=>f) {
    this.changeListeners.push(fn);
  }
  addActionListener(name, fn) {
    if (this.actionListeners[name]) {
      this.actionListeners.push(fn);
    } else {
      this.actionListeners[name] = [fn];
    }
  }
  emitOnChange() {
    this.changeListeners.forEach(fn => fn(this));
  }
  emitAction(name, ...args) {
    const listeners = this.actionListeners[name];
    if (listeners) {
      listeners.forEach(fn => fn(...args));
    }
  }
  get isActive() {
    return this.isReady && ['idle', 'turn'].includes(this.state);
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
      firstWinCount: this.firstWinCount,
      loseCount: this.loseCount,
    }
  }
  get playerPersonalData() {
    return {...this};
  }
  reset() {
    this.state = 'wait';
    this.isReady = false;
    this.cards = [];
    this.actionListeners = [];
    this.emitOnChange();
  }
  setLose() {
    this.state = 'lose';
    this.loseCount++;
    this.emitOnChange();
  }
  setWin(isFirst) {
    this.state = 'win';
    this.firstWinCount += isFirst;
    this.emitOnChange();
  }
  setReady(data) {
    if (this.state === 'wait') {
      this.isReady = data;
      this.emitOnChange();
    }
  }
  setConnected(data) {
    this.isConnected = data;
    this.emitOnChange();
  }
  addCard(card) {
    this.cards.push(card);
    this.emitOnChange();
  }
  setState(state) {
    this.state = state;
    this.emitOnChange();
  }
  removeCard(card) {
    const index = this.cards.indexOf(card);
    if (index !== -1) {
      const c = this.cards;
      c.splice(index, 1);
      this.cards = c;
    }
    this.emitOnChange();
  }
  onMove(cardId) {
    if (this.state !== 'turn') {
      throw new Error(`It is not ${this.name}'s turn to move`);
    }
    if (!this.cards.find(c => c.id === cardId)) {
      throw new Error(`${this.name} do not have this card in hand`);
    }
    this.emitAction('onMove', cardId);
  }
  onTakeCard() {
    if (this.state !== 'turn') {
      throw new Error(`It is not ${this.name}'s turn to move`);
    }
    this.emitAction('onTakeCard');
  }
}

module.exports = Player;
