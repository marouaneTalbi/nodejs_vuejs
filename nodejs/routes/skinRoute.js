const express = require('express');
const skinRoute = express.Router();
const SkinController = require('../controllers/skin/SkinController');
const authMiddleware = require("../middlewares/authMiddleware");

skinRoute.use(authMiddleware());
skinRoute.get('/skin/:id', SkinController.getSkinById)
skinRoute.get('/skins', SkinController.getAllSkins)
skinRoute.post('/skin/create', SkinController.createSkin)
skinRoute.patch('/skin/update/:id', SkinController.updateSkin)
skinRoute.delete('/skin/delete/:id', SkinController.deleteSkin)
skinRoute.post('/skin/purchase', SkinController.purchaseSkin)
skinRoute.post('/skin/assign', SkinController.assignSkinToUser)
skinRoute.post('/skin/pay', SkinController.paySkin)



module.exports = skinRoute;
