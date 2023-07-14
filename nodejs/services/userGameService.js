const UserGame = require('../models/userGameModel');
const { Op } = require("sequelize");

exports.deleteUserGame = async(gameId, userId) => {
    try {

        await UserGame.destroy({ where: { user_id: userId } });
        return;
        
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
