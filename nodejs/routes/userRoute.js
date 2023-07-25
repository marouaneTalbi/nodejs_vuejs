const express = require('express');
const UserController = require('../controllers/UserController');
const AdminController = require('../controllers/AdminController');
const route = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

// Public routes

route.post('/login', UserController.login)
route.post('/register', UserController.register)
route.get('/current-user', UserController.getCurrentUser);
route.post('/confirm', UserController.confirm)
route.get('/user/:id/postgres', UserController.getUserById)
route.post('/forgotPassword',  UserController.forgotPassword);
route.post('/initPassword',  UserController.initPassword);
route.put('/user/:id/verify-email', UserController.updateIsConfirmed);
route.get('/user/:id/stats', UserController.getUserStats);
route.get('/user/:id/games-history', UserController.getUserGamesHistory);

// Routes protected by authentication middleware
const gamerAuthMiddleware = authMiddleware();
route.get('/user/skins/:id',gamerAuthMiddleware, UserController.getUserSkins);
route.get('/user/skin/:id',gamerAuthMiddleware, UserController.getUserSkin);
route.post('/logout',gamerAuthMiddleware,  UserController.logout);
route.put("/user/:id/updateuser",gamerAuthMiddleware, UserController.updateUser);
route.put('/user/:id/change-password',gamerAuthMiddleware, UserController.changePassword);
route.patch('/user/:id/pic', AdminController.updateUserPicture)


// Routes protected by authentication and role Admin
<<<<<<< HEAD

route.use(authMiddleware(['admin']));
route.get('/user/:id', AdminController.getUser)
route.get('/users', AdminController.getUsers)
route.delete('/user/:id', AdminController.deleteUser)
route.patch('/user/:id', AdminController.updateUser)
=======
const adminAuthMiddleware = authMiddleware(["admin"]);
route.get('/user/:id',adminAuthMiddleware, AdminController.getUser)
route.get('/users',adminAuthMiddleware, AdminController.getUsers)
route.delete('/user/:id',adminAuthMiddleware, AdminController.deleteUser)
route.patch('/user/:id', adminAuthMiddleware,AdminController.updateUser)
route.patch('/user/:id/pic',adminAuthMiddleware, AdminController.updateUserPicture)
>>>>>>> develop

module.exports = route;






