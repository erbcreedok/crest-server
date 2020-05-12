const express = require('express');
const router = express.Router();
const Player = require('../game/players/Player');
const playerService = require('../game/players/player.service');
const roomService = require('../game/rooms/room.service');
const createNewRoom = require('../game/rooms/createNewRoom');

function getNameAndRoom(req) {
  let name = '';
  let room;
  if (!(req.body && req.body.name)) {
    throw new Error('No name provided!');
  }
  name = req.body.name;
  if (req.body.room) {
    room = roomService.findRoomById(req.body.room);
    if (!room) {
      throw new Error('Room does not exist!');
    }
  } else {
    room = createNewRoom(`${req.body.name}'s room`, req.io);
  }
  return {name, room};
}

const handleRequestActivity = fn => (req, res, ...rest) => {
  try {
    fn(req, res, ...rest);
  } catch ({ message }) {
    res.status(400).send({ message });
  }
};

router.get('/user', (req, res) => {
  const sessionId = req.session ? req.session.id : undefined;
  const player = playerService.findPlayerByIp(sessionId);
  res.json(player);
});

router.post('/user', handleRequestActivity((req,res) => {
  const sessionId = req.session ? req.session.id : undefined;
  const {name, room} = getNameAndRoom(req);
  const oldPlayer = room.findPlayerByName(name);
  if (oldPlayer) {
    throw new Error('That name is already taken');
  }
  const player = new Player(name, sessionId, room.id);
  room.addPlayer(player);
  playerService.addNewPlayer(player);
  res.json(player.playerPersonalData)
}));

router.post('/old_user', handleRequestActivity((req, res) => {
  const {name, room} = getNameAndRoom(req);
  const oldPlayer = room.findPlayerByName(name);
  if (oldPlayer && !oldPlayer.isConnected) {
    res.json(oldPlayer.playerPersonalData);
  } else {
    throw new Error(`Player doesn't exist or he is online`);
  }
}));

module.exports = router;
