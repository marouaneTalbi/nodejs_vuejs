const UserGame = require('../../models/userGameModel');
const User = require('../../models/userModel');
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
        const { opponentId } = req.body;
        const { date } = req.body;
        let newUserPoints; 

        const user = await User.findByPk(userId);
        const opponent = await User.findByPk(opponentId);

        if(result === "win") {
            console.log('win - pseudo : ', user.pseudo)
            const eloChange = calculateEloChange(user.points, opponent.points, false);
            newUserPoints = user.points + eloChange.deltaPointsX;
            console.log('new elo : ', newUserPoints);
        }
        if(result === "loose") {
            console.log('loose - pseudo : ', user.pseudo)
            const eloChange = calculateEloChange(user.points, opponent.points, false);
            newUserPoints = user.points + eloChange.deltaPointsY;
            console.log('new elo : ', newUserPoints);
        }
        if(result === "equality") {
            console.log('draw - pseudo : ', user.pseudo)
            const eloChange = calculateEloChange(user.points, opponent.points, true);
            newUserPoints = user.points + eloChange.deltaPointsX;
            console.log('new elo : ', newUserPoints);
        }

        await user.update({points: newUserPoints});

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
  
  