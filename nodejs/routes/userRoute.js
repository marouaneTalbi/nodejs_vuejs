const express = require('express');
const app = express();
const UserController = require('../controllers/UserController');
const AdminController = require('../controllers/AdminController');
const route = express.Router();

route.post('/login', UserController.login)
route.post('/register', UserController.register)
route.get('/users', AdminController.getUsers)


module.exports = route;






