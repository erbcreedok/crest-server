const express = require('express')
const router = express.Router()
const Player = require('../game/players/Player')
const Room = require('../game/rooms/Room')
const playerService = require('../game/players/player.service')
const roomService = require('../game/rooms/room.service')

router.get('/user', (req, res) => {
  const sessionId = req.session.id;
  console.log({sessionId});
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
    room = new Room(`${req.body.name}'s room`);
    roomService.addNewRoom(room);
  }
  const sessionId = req.session.id;
  const player = new Player(req.body.name, sessionId, room.id);
  room.addPlayer(player);
  req.io.to(room.id).emit('notification', {message: `Player ${player.name} has joined room`});
  playerService.addNewPlayer(player);
  res.json(player)
  console.log(playerService.players)
})

module.exports = router
