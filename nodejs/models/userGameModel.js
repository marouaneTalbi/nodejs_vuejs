const { Sequelize, DataTypes } = require('sequelize');
const Game = require('./gameModel');
const User = require('./userModel');

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
    }
}, {
    tableName: 'user_game',
    timestamps: false
});

module.exports = UserGame;