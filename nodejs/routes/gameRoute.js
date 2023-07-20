const express = require('express');
const gameRoute = express.Router();
const GameController = require('../controllers/GameController');

gameRoute.get('/game/:id', GameController.findGameById)

module.exports = gameRoute;