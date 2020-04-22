const playerService = {
  players: [],
  addNewPlayer(player) {
    this.players.unshift(player)
  },
  findPlayerByIp(ip) {
    return this.players.find(p => p.ip === ip);
  },
  findPlayerById(id) {
    return this.players.find(p => p.id === id);
  },
}

module.exports = playerService;
