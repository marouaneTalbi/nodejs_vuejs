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
route.post('/resend-confirmation-email', UserController.resendMail);
route.get('/user/:id', AdminController.getUser)

// Routes protected by authentication middleware
const gamerAuthMiddleware = authMiddleware();
route.get('/user/skins/:id',gamerAuthMiddleware, UserController.getUserSkins);
route.get('/user/skin/:id',gamerAuthMiddleware, UserController.getUserSkin);
route.post('/logout',gamerAuthMiddleware,  UserController.logout);
route.put("/user/:id/updateuser",gamerAuthMiddleware, UserController.updateUser);
route.put('/user/:id/change-password',gamerAuthMiddleware, UserController.changePassword);
route.patch('/user/:id/pic', gamerAuthMiddleware, AdminController.updateUserPicture)
route.patch('/user/:id', gamerAuthMiddleware,AdminController.updateUser)


// Routes protected by authentication and role Admin
const adminAuthMiddleware = authMiddleware(["admin"]);
route.get('/users',adminAuthMiddleware, AdminController.getUsers)
route.delete('/user/:id',adminAuthMiddleware, AdminController.deleteUser)

module.exports = route;






