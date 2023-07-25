const express = require('express');
const gradeRoute = express.Router();
const GradeController = require('../controllers/grade/GradeController');
const authMiddleware = require("../middlewares/authMiddleware");

const adminAuthMiddleware = authMiddleware(['admin']);
gradeRoute.post('/grade/create', adminAuthMiddleware, GradeController.createGrade)
gradeRoute.patch('/grade/update/:id', adminAuthMiddleware, GradeController.updateGrade)
gradeRoute.delete('/grade/delete/:id', adminAuthMiddleware, GradeController.deleteGrade)
gradeRoute.get('/admin/grade/:id', adminAuthMiddleware, GradeController.getGradeById)

const bothAuthMiddleware = authMiddleware(['admin','gamer']);
gradeRoute.get('/grades',  bothAuthMiddleware, GradeController.getAllGrades)
gradeRoute.get('/grade/:id', bothAuthMiddleware, GradeController.getGradeByUserId)
gradeRoute.get('/top-gamers',bothAuthMiddleware,  GradeController.getTopGamers)

module.exports = gradeRoute;
