const express = require('express');
const app = express();
const UserController = require('../controllers/UserController');
const AdminController = require('../controllers/AdminController');
const route = express.Router();

// AUTH
route.post('/login', UserController.login)
route.post('/register', UserController.register)
route.post('/logout',  UserController.logout);
route.get('/current-user', UserController.getCurrentUser);
// USER
route.get('/user/:id', AdminController.getUser)
route.get('/users', AdminController.getUsers)
route.delete('/user/:id', AdminController.deleteUser)
route.patch('/user/:id', AdminController.updateUser)

module.exports = route;






