const express = require('express')
const router = express.Router()
const Player = require('../game/players/Player')
const playerService = require('../game/players/player.service')
const roomService = require('../game/rooms/room.service')
const createNewRoom = require('../game/rooms/createNewRoom')

router.get('/user', (req, res) => {
  const sessionId = req.session ? req.session.id : undefined;
  console.log(sessionId);
  const player = playerService.findPlayerByIp(sessionId);
  res.json(player);
})

router.post('/user',(req,res) => {
  if (!(req.body && req.body.name)) {
    res.status(400).send({
      message: 'No name provided!'
    });
    return;
  }
  let room;
  if (req.body.room) {
    room = roomService.findRoomById(req.body.room);
    if (!room) {
      res.status(400).send({
        message: `Room does not exist!`
      });
    }
  } else {
    room = createNewRoom(`${req.body.name}'s room`, req.io);
  }
  const sessionId = req.session ? req.session.id : undefined;
  console.log('we here', sessionId);
  const player = new Player(req.body.name, sessionId, room.id);
  room.addPlayer(player);
  playerService.addNewPlayer(player);
  res.json(player.playerPersonalData)
})

module.exports = router
