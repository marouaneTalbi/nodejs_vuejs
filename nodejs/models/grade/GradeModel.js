const { DataTypes, Sequelize } = require('sequelize');
const User = require('../userModel');

const sequelize = new Sequelize({
    dialect: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'mydatabase',
    username: 'myuser',
    password: 'mypassword',
    timestamps:false

});

const Grade = sequelize.define('grade', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    picture: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    required_points: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'grade',
    timestamps: false
});


module.exports = Grade;
