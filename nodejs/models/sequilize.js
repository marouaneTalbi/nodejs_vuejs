const { Sequelize, DataTypes, Op } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

 const sequelize = new Sequelize({
    dialect: process.env.SEQUELIZE_DIALECT ,
    host: process.env.SEQUELIZE_HOST ,
    port: process.env.SEQUELIZE_PORT ,
    database: process.env.SEQUELIZE_DATABASE ,
    username: process.env.SEQUELIZE_USERNAME ,
    password: process.env.SEQUELIZE_PASSWORD ,
    timestamps:false
  });
  
  module.exports = { sequelize };