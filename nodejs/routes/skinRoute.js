const express = require('express');
const skinRoute = express.Router();
const SkinController = require('../controllers/skin/SkinController');
const authMiddleware = require("../middlewares/authMiddleware");

// const AuthMiddleware = authMiddleware();
skinRoute.get('/skin/:id', AuthMiddleware, SkinController.getSkinById)
skinRoute.get('/skins',AuthMiddleware, SkinController.getAllSkins)
skinRoute.post('/skin/create',AuthMiddleware, SkinController.createSkin)
skinRoute.patch('/skin/update/:id',AuthMiddleware, SkinController.updateSkin)
skinRoute.delete('/skin/delete/:id',AuthMiddleware, SkinController.deleteSkin)
skinRoute.post('/skin/purchase', AuthMiddleware,SkinController.purchaseSkin)
skinRoute.post('/skin/assign', AuthMiddleware,SkinController.assignSkinToUser)
skinRoute.post('/skin/pay', AuthMiddleware,SkinController.paySkin)

module.exports = skinRoute;
