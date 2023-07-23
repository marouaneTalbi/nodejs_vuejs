const express = require('express');
const UserController = require('../controllers/UserController');
const AdminController = require('../controllers/AdminController');
const route = express.Router();
// const authMiddleware = require('../middlewares/authMiddleware');

// Public routes

route.post('/login', UserController.login)
route.post('/register', UserController.register)
route.get('/current-user', UserController.getCurrentUser);
route.post('/confirm', UserController.confirm)
route.get('/user/:id/postgres', UserController.getUserById)
route.post('/forgotPassword',  UserController.forgotPassword);
route.post('/initPassword',  UserController.initPassword);
route.put('/user/:id/verify-email', UserController.updateIsConfirmed);

// Routes protected by authentication middleware
route.use(authMiddleware());
route.get('/user/skins/:id', UserController.getUserSkins);
route.get('/user/skin/:id', UserController.getUserSkin);

route.post('/logout',  UserController.logout);
route.put("/user/:id/updateuser", UserController.updateUser);
route.put('/user/:id/change-password', UserController.changePassword);


// Routes protected by authentication and role Admin
route.use(authMiddleware(['gamer']));

route.get('/user/:id', AdminController.getUser)
route.get('/users', AdminController.getUsers)
route.delete('/user/:id', AdminController.deleteUser)
route.patch('/user/:id', AdminController.updateUser)


module.exports = route;






