const UserGame = require('../../models/userGameModel');
const User = require('../../models/userModel');
const { Op } = require("sequelize");
const UserGameMongo = require('../../models/user_game/userGameModelMongo');
const UserController = require('../../controllers/UserController');

exports.createUserGame = async(gameId, userId, gamemode) => {
    try {
        console.log('gamemode : ', gamemode)
        const user_game = await UserGame.create({
            user_id: userId,
            game_id: gameId,
            gamemode: gamemode
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

exports.Players = async(req, res) => {

    const {id} = req.params

     try {

        const userIds = await UserGame.findAll({
            where:{
                game_id: req.params.id
            }
        })

        const e = userIds.map(ug => ug.dataValues);

        res.json(e);


    } catch(error) {
        throw error;
    }
}

exports.deleteUserGame = async(gameId, userId) => {
    try {

        await UserGame.destroy({ where: { user_id: userId } });

        await UserGameMongo.deleteOne({ user_id: userId, game_id: gameId });
        return;
        
    } catch(error) {
        throw error;
    }
}

exports.updateUserGame = async(req, res) => {
    try {

        const { userId, gameId } = req.params;
        const { result } = req.body;
        const { opponentId } = req.body;
        const { date } = req.body;
        const { game } = req.body;
        console.log('opponent ID : ', opponentId)
        let newUserPoints; 
        let eloChange;
        let pointsWin;
        const user = await User.findByPk(userId);
        const opponent = await User.findByPk(opponentId);
        if (game.gamemode == "ranked") {
            console.log('ranked')
            if(result === "win") {
                eloChange = calculateEloChange(user.points, opponent.points, false);
                newUserPoints = user.points + eloChange.deltaPointsX;
            }
            if(result === "loose") {
                eloChange = calculateEloChange(user.points, opponent.points, false);
                newUserPoints = user.points + eloChange.deltaPointsY;
                console.log('loose new elo : ', newUserPoints)
            }
            if(result === "equality") {
                eloChange = calculateEloChange(user.points, opponent.points, true);
                newUserPoints = user.points + eloChange.deltaPointsX;
            }

            await user.update({points: newUserPoints});

            if (result === "loose") {
                console.log(userId, 'à perdu, et devrait etre update en postgres')
                const user_game = await UserGame.update(
                    { result: result, pointswin: eloChange.deltaPointsY },
                    {
                        where: {
                            user_id: userId,
                            game_id: gameId
                        }
                    }
                );
                return user_game;
            }
            
            const user_game = await UserGame.update(
                { result: result, pointswin: eloChange.deltaPointsX },
                {
                    where: {
                        user_id: userId,
                        game_id: gameId
                    }
                }
            );

            await UserController.updateUserGrade(user);

            return res.status(200).json({ user_game });
        }

        console.log('unranked')
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
        console.error(error)
        return res.status(500).json({ message: error })
    }
}
function calculateEloChange(winnerPoints, loserPoints, isDraw) {
    console.log('calcul elo')
    const K1 = 100; // Constante pour le gagnant
    const K2 = 120; // Constante pour le perdant
  
    // Calcul de la probabilité de victoire du joueur X
    const probabilityX = 1 / (1 + 10 ** ((loserPoints - winnerPoints) / 400));
  
    // Calcul du delta de points en cas de victoire, défaite ou égalité
    let deltaPointsX, deltaPointsY;
  
    if (isDraw) {
      deltaPointsX = 0;
      deltaPointsY = 0;
    } else {
      if (winnerPoints > loserPoints) {
        // Le joueur gagnant prend plus de points lorsqu'il a moins de points que l'adversaire
        deltaPointsX = K1 * (1 - probabilityX);
        deltaPointsY = K2 * (0 - probabilityX);
      } else {
        // Le joueur gagnant prend moins de points lorsqu'il a plus de points que l'adversaire
        deltaPointsX = K2 * (1 - probabilityX);
        deltaPointsY = K1 * (0 - probabilityX);
      }
    }
  
    // Arrondir les valeurs à des entiers
    deltaPointsX = Math.round(deltaPointsX);
    deltaPointsY = Math.round(deltaPointsY);
  
    return { deltaPointsX, deltaPointsY };
  }
  
  