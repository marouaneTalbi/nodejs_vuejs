const Game = require('../models/gameModel')
const UserGame = require('../models/userGameModel');

exports.createGame = async(gamemode, userId) => {
    try {
        
        const [game, created] = await Game.findOrCreate({
            where: { 
                gamemode,
                status: 'waiting'
            },
            defaults: { status: 'waiting' }
        });

        console.log('user : ', userId);
        console.log('game : ', game.id);

        await UserGame.create({
            user_id: userId,
            game_id: game.id
        });

        return game;
    } catch(error) {

        throw error;
        
    }
}

exports.updateGame = async(gameId, updatedData) => {
    try {
        const game = await Game.findByPk(gameId);
    
        if (!game) {
            return res.status(404).json({ message: 'La partie n\'existe pas' })
        }
    
        await game.update(updatedData);

        return res.status(200).json({ game });

    } catch (error) {
        return res.status(500).json({ message: 'Erreur lors de la mise à jour de la game' });
    }
}