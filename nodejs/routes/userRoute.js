const express = require('express');
const app = express();
const session = require('express-session');
const UserController = require('../controllers/UserController');
const route = express.Router();

route.post('/login',UserController.login)
route.post('/register',  UserController.register)
route.get("/user/:id", UserController.getOne);
route.post('/logout', UserController.logout);
route.put("/user/:id", UserController.updateUser);
route.put('/user/:id/verify-email', UserController.updateIsConfirmed);

module.exports = route;






