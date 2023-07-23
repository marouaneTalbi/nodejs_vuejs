const UserGameMongo = require('../models/user_game/userGameModelMongo');

async function getUserStats(userId) {
    try {
        console.log(userId)
        
        const result = await UserGameMongo.aggregate([
            {
                $match: {
                    user_id: Number(userId),
                    result: { $in: ['win', 'loose'] } // Filtrer uniquement les victoires et les défaites
                }
            },
            {
                $group: {
                    _id: '$user_id',
                    totalVictories: {
                        $sum: {
                            $cond: { if: { $eq: ['$result', 'win'] }, then: 1, else: 0 }
                        }
                    },
                    totalDefeats: {
                        $sum: {
                            $cond: { if: { $eq: ['$result', 'loose'] }, then: 1, else: 0 }
                        }
                    },
                    totalGames: {
                        $sum: 1 // Compter le nombre total de parties jouées
                    }
                }
            },
            {
                $project: {
                    totalVictories: 1,
                    totalDefeats: 1,
                    totalGames: 1,
                    winRate: {
                        $multiply: [
                            { $divide: ['$totalVictories', '$totalGames'] }, // Calculer le pourcentage de taux de victoires
                            100
                        ]
                    },
                    loseRate: {
                        $multiply: [
                            { $divide: ['$totalDefeats', '$totalGames'] }, // Calculer le pourcentage de taux de défaites
                            100
                        ]
                    }
                }
            }
        ]);
        
        return result;
    } catch(error) {
        throw error;
    }
}

module.exports = { getUserStats };
