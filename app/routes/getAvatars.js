const express = require('express');
const router = express.Router();
const avatars = require('../game/players/avatars');
const emotions = require('../game/players/emotions');

router.get('/avatars', (req,res) => {
  res.json(avatars);
});
router.get('/emotions', (req,res) => {
  res.json(emotions);
});

module.exports = router;
