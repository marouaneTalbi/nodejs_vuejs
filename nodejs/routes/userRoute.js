const express = require('express');
const UserController = require('../controllers/UserController')
const route = express.Router();

route.post('/login', UserController.login)
route.post('/register', UserController.register)


module.exports = route;




// const d = 'test';
// const salt = bcrypt.genSaltSync(10);
// const hashedPassword = bcrypt.hashSync(password, salt);
// console.log(hashedPassword)

