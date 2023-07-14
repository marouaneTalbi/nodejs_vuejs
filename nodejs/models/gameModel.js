const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'mydatabase',
    username: 'myuser',
    password: 'mypassword'
});

const Game = sequelize.define('game', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    code: {
        type: DataTypes.STRING(255),
        // à changer
        allowNull: true
    },
    status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "waiting"
    },
    gamemode: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    chat_fk_id: {
        type: DataTypes.INTEGER,
        // à changer
        allowNull: true,
        references: {
            model: 'Chat',
            key: 'id'
        }
    }
}, {
    tableName: 'game',
    timestamps: false
});

module.exports = Game;