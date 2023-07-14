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

const Skin = sequelize.define('skin', {
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
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  money_type: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
}, {
  tableName: 'skin',
  timestamps: false
});


module.exports = Skin;
