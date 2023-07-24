const express = require('express');
const gradeRoute = express.Router();
const GradeController = require('../controllers/grade/GradeController');
const authMiddleware = require("../middlewares/authMiddleware");

const gamerAuthMiddleware = authMiddleware(['gamer']);
gradeRoute.get('/grade/:id', gamerAuthMiddleware, GradeController.getGradeByUserId)
gradeRoute.get('/top-gamers',gamerAuthMiddleware,  GradeController.getTopGamers)

const adminAuthMiddleware = authMiddleware(['admin']);
gradeRoute.post('/grade/create', adminAuthMiddleware, GradeController.createGrade)
gradeRoute.patch('/grade/update/:id', adminAuthMiddleware, GradeController.updateGrade)
gradeRoute.delete('/grade/delete/:id', adminAuthMiddleware, GradeController.deleteGrade)

const bothAuthMiddleware = authMiddleware(['admin','gamer']);
gradeRoute.get('/grades',  bothAuthMiddleware, GradeController.getAllGrades)

module.exports = gradeRoute;