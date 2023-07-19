const Game = require('../models/gameModel')
const UserGame = require('../models/userGameModel');
const { v4: uuidv4 } = require("uuid");

exports.createGame = async(gamemode, userId) => {
    try {
        
        if(gamemode === "private") {

            code = uuidv4();
            const game = await Game.create({
                gamemode,
                status: "waiting",
                code,
            });
            await UserGame.create({
                user_id: userId,
                game_id: game.id,
            });
            return game;

        } else {

            const [game, created] = await Game.findOrCreate({
                where: { 
                    gamemode,
                    status: 'waiting'
                },
                defaults: { status: 'waiting' }
            });
            await UserGame.create({
                user_id: userId,
                game_id: game.id
            });
            return game;

        }
        
    } catch(error) {

        throw error;
        
    }
}

exports.findGameById = async(req, res) => {
    try {

        const { id } = req.params;
        const game = await Game.findByPk(id);

        if(!game) {
            return res.status(404).json({ error: 'Game not found' });
        }

        return res.status(200).json(game);

    } catch(error) {

        return res.status(500).json({ message: 'Erreur lors de la récupération de la game' })

    }
}

exports.updateGame = async(gameId, updatedData) => {
    try {
        const game = await Game.findByPk(gameId);
    
        if (!game) {
            return res.status(404).json({ message: 'La partie n\'existe pas' })
        }
    
        await game.update(updatedData);

        return game;

    } catch (error) {
        return 'Erreur lors de la mise à jour de la game' ;
    }
}

exports.findGameByCode = async (code) => {
    try {

        const game = await Game.findOne({ where: { code } });
        return game;

    } catch (error) {

        throw error;

    }
};