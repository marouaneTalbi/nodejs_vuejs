const express = require('express');
const app = express();
const session = require('express-session');
const UserController = require('../controllers/UserController');
const AdminController = require('../controllers/AdminController');
const route = express.Router();

route.post('/login',UserController.login)
route.post('/register',  UserController.register)
route.get("/user/:id", UserController.getOne);
route.post('/logout', UserController.logout);
route.put("/user/:id", UserController.updateUser);
route.put('/user/:id/verify-email', UserController.updateIsConfirmed);
route.get('/user/:id', AdminController.getUser)
route.get('/users', AdminController.getUsers)
route.delete('/user/:id', AdminController.deleteUser)
route.patch('/user/:id', AdminController.updateUser)

module.exports = route;






