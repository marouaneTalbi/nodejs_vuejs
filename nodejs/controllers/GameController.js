const Game = require('../models/gameModel')
const UserGame = require('../models/userGameModel');

exports.createGame = async(gamemode, userId) => {
    try {
        
        const [game, created] = await Game.findOrCreate({
            where: { gamemode },
            defaults: { status: 'waiting' }
        });

        await UserGame.create({
            user_id: userId,
            game_id: game.id
        });

        return game;
    } catch(error) {

        throw error;
        
    }
}