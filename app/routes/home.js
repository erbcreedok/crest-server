const express = require('express')
const router = express.Router()
const GameController = require('../game/GameController/GameController')
const Player = require('../game/players/Player')

router.get('/',(req,res)=>{
  const players = [new Player('Yerbol'), new Player('asa'), new Player('vega'), new Player('Шымкент'), new Player('Арендатор')]
  const game = new GameController(players, '12');
  game.startNewGame();
  res.send(`<pre>${JSON.stringify(game.getGameStats(players[4].id), null, '\t')}</pre>`);
})

module.exports = router
