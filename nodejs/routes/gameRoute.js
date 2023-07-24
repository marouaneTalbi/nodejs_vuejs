const express = require('express');
const gameRoute = express.Router();
const GameController = require('../controllers/GameController');
const authMiddleware = require("../middlewares/authMiddleware");

const AuthMiddleware = authMiddleware();
gameRoute.get('/game/:id',AuthMiddleware, GameController.findGameById)

module.exports = gameRoute;