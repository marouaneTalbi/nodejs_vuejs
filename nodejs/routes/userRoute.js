const express = require('express');
const app = express();
const UserController = require('../controllers/UserController')
const route = express.Router();

route.post('/login', UserController.login)
route.post('/register', UserController.register)
route.get("/user/:id", UserController.getOne);
route.post('/logout',  UserController.logout);

module.exports = route;






