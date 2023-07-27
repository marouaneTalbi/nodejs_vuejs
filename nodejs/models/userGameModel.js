const { Sequelize, DataTypes } = require('sequelize');
const Game = require('./gameModel');
const User = require('./userModel');
const UserGameMongo = require('./user_game/userGameModelMongo');

const sequelize = new Sequelize({
    dialect: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'mydatabase',
    username: 'myuser',
    password: 'mypassword'
});

const UserGame = sequelize.define('user_game', {
    game_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: Game,
            key: 'id'
        }
    },
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    result: {
        type: DataTypes.STRING,
        allowNull: true
    },
    pointswin: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    gamemode: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'user_game',
    timestamps: false
});


UserGame.afterCreate(async (userGame, options) => {
    try {
        await UserGameMongo.create({
            user_id: userGame.user_id,
            game_id: userGame.game_id,
            result: userGame.result,
            gamemode: userGame.gamemode,
            date: new Date()
        })

        console.log('User creation in MongoDB successful');
    } catch (error) {
        console.error('An error occurred after user deletion in MongoDB:', error);
    }
});

UserGame.afterBulkUpdate(async (userGame, options) => {
    try {
        console.log(userGame.where.user_id, 'à gagné : ', userGame.attributes.pointswin)
        await UserGameMongo.updateOne(
            { user_id: userGame.where.user_id, game_id: userGame.where.game_id },
            { result: userGame.attributes.result, date: userGame.attributes.date, pointswin: userGame.attributes.pointswin, gamemode: userGame.attributes.gamemode }
        )

        console.log('User update in MongoDB successful');
    } catch (error) {
        console.error('An error occurred after user update in MongoDB:', error);
    }
});

// UserGame.afterUpdate(async (userGame, options) => {
//     try {
//         await UserGameMongo.updateOne(
//             { user_id: userGame.user_id, game_id: userGame.game_id }, 
//             { result: userGame.result }
//         );

//         console.log('User update in MongoDB successful');
//     } catch (error) {
//         console.error('An error occurred after user update in MongoDB:', error);
//     }
// });

module.exports = UserGame;