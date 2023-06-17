const Sequelize = require('sequelize');
const User = require('../models/userModel');




module.exports = {
    development: {
        host: 'localhost',
        port: 5432,
        database: 'mydatabase',
        username: 'myuser',
        password: 'mypassword',
        dialect: 'postgres'
    },
  };

    // async function e() {
    //   const user = await User.findAll()
    //   return user;
    // }

    // e().then(user => {
    //     console.log(user);
    // })
    // .catch(error => {
    //     console.error(error);
    // });


