const express = require('express');
const userGameRoute = express.Router();
const UserGameController = require('../controllers/UserGame/UserGameController');
const authMiddleware = require('../middlewares/authMiddleware');


userGameRoute.patch('/user/:userId/game/:gameId', UserGameController.updateUserGame);
userGameRoute.get('/game/players/:id', UserGameController.Players)

module.exports = userGameRoute;