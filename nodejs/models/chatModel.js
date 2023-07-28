const { Sequelize, DataTypes } = require('sequelize');
const UserMongo = require('./userModelMongo');
const Game = require('./gameModel');
const User = require('./userModel');

const sequelize = new Sequelize({
    dialect: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'mydatabase',
    username: 'myuser',
    password: 'mypassword',
    timestamps:false
});

const Chat = sequelize.define('chat', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    report: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'User',
            key: 'id'
        }
    }
}, {
    tableName: 'chat',
    timestamps: false,
    subQuery: false
});

/*Skin.belongsToMany(User, { through: 'user_skin', foreignKey: 'skin_id', onDelete: 'CASCADE' });
User.belongsToMany(Skin, { through: 'user_skin', foreignKey: 'user_id', onDelete: 'CASCADE' });*/

/*Chat.afterCreate(async (chat, options) => {
    try {
        await ChatMongo.create({
            _id: chat.id,
            user_id: chat.user_id,
            content: chat.content,
            report: chat.report,
        })
        console.log('Chat creation in MongoDB successful');
    } catch (error) {
        console.error('An error occurred after user deletion in MongoDB:', error);
    }
})

Chat.afterUpdate(async (user, options) => {
    try {
        const changedFields = chat.changed();

        changedFields.map(async (field) => {
            const updateObj = {};
            updateObj[field] = chat[field];
            await ChatMongo.findByIdAndUpdate(chat.id, updateObj);
        })

    } catch (error) {
        console.error('An error occurred after chat deletion in MongoDB:', error);
    }
})*/
module.exports = Chat;
