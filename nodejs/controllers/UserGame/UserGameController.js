const UserGame = require('../../models/userGameModel');
const { Op } = require("sequelize");

exports.createUserGame = async(gameId, userId) => {
    try {

        const user_game = await UserGame.create({
            user_id: userId,
            game_id: gameId,
        });
        return user_game;

    } catch(error) {

        throw error;

    }
}

exports.UsersInGame = async(gameId) => {
    try {

        const usersCount = await UserGame.count({
            where : {
                game_id: {
                    [Op.eq]: gameId
                }
            }
        })
        return usersCount;

    } catch(error) {
        throw error;
    }
}

exports.PlayersOfGame = async(gameId) => {
    try {

        const userGames = await UserGame.findAll({
            where : {
                game_id: {
                    [Op.eq]: gameId
                }
            }
        })

        const userIds = userGames.map(ug => ug.dataValues.user_id);
        
        return userIds;

    } catch(error) {
        throw error;
    }
}

exports.deleteUserGame = async(gameId, userId) => {
    try {

        await UserGame.destroy({ where: { user_id: userId } });
        return;
        
    } catch(error) {
        throw error;
    }
}

exports.updateUserGame = async(req, res) => {
    try {

        const { userId, gameId } = req.params;
        const { result } = req.body;
        const { date } = req.body;
        console.log('date: ' , date);
        console.log(gameId);

        const user_game = await UserGame.update(
            { result: result },
            {
                where: {
                    user_id: userId,
                    game_id: gameId
                }
            }
        );

        return res.status(200).json({ user_game });


    } catch(error) {
        return res.status(500).json({ message: 'server error' })
    }
}