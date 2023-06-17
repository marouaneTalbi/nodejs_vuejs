const express = require('express');
const app = express();
const UserController = require('../controllers/UserController')
const route = express.Router();

route.post('/login', UserController.login)
route.post('/register', UserController.register)


module.exports = route;






