const express = require('express');
const app = express();
const session = require('express-session');
const UserController = require('../controllers/UserController');
const AdminController = require('../controllers/AdminController');

const route = express.Router();


//route.get("/user/:id", UserController.getOne);
route.put("/user/:id/updateuser", UserController.updateUser);
route.put('/user/:id/verify-email', UserController.updateIsConfirmed);

// AUTH
route.post('/login', UserController.login)
route.post('/register', UserController.register)
route.post('/logout',  UserController.logout);
route.get('/current-user', UserController.getCurrentUser);
route.post('/confirm', UserController.confirm)
route.get('/user/:id/postgres', UserController.getUserById)
route.post('/forgotPassword',  UserController.forgotPassword);
route.post('/initPassword',  UserController.initPassword);

// USER
route.get('/user/:id', AdminController.getUser)
route.get('/users', AdminController.getUsers)
route.delete('/user/:id', AdminController.deleteUser)
route.patch('/user/:id', AdminController.updateUser)
route.put('/user/:id/change-password', UserController.changePassword)
route.get('/user/skins/:id', UserController.getUserSkins);
route.get('/user/skin/:id', UserController.getUserSkin);



module.exports = route;






