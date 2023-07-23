const express = require('express');
const userGameRoute = express.Router();
const UserGameController = require('../controllers/UserGame/UserGameController');

userGameRoute.patch('/user/:userId/game/:gameId', UserGameController.updateUserGame);

module.exports = userGameRoute;