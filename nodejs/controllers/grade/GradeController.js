const path = require('path');
const Grade = require('../../models/grade/GradeModel');
const User = require('../../models/userModel');
const { v4: uuidv4 } = require('uuid');
var base64ToImage = require('base64-to-image');
const { Op } = require('sequelize');

exports.getAllGrades = async (req, res) => {
    try {
        const grades = await Grade.findAll();
        grades.forEach((grade) => {
            grade.picture = path.join('/pictures/grades/', grade.picture);
        });
        res.json(grades);
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la récupération des grades:', error);
        res.status(500).json({ message: 'Une erreur s\'est produite lors de la récupération des grades' });
    }
};

exports.getTopGamers = async (req, res) => {
    try {
        const topGamers = await User.findAll({
            order: [['points', 'DESC']],
            limit: 10,
        });
        if (topGamers) {
            res.json(topGamers);
        } else {
            res.json([]);
        }
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la récupération des top Gamers:', error);
        res.status(500).json({ message: 'Une erreur s\'est produite lors de la récupération des top gamers' });
    }
};

exports.getGradeByUserId = async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findByPk(userId);
        if (user) {
            const points = user.points;
            const grade = await Grade.findOne({
                where: {
                    required_points: { [Op.lte]: points },
                },
                order: [['required_points', 'DESC']],
            });
            if (grade) {
                res.json({ points,grade });
            } else {
                res.status(404).json({ message: 'Grade non trouvé pour les points de l\'utilisateur' });
            }
        } else {
            res.status(404).json({ message: 'User non trouvé' });
        }
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la récupération du grade:', error);
        res.status(500).json({ message: 'Une erreur s\'est produite lors de la récupération du grade' });
    }
};


function saveGradeImage(imageTitle, imageData) {
    const fileName = uuidv4()+ '_' +imageTitle
    const imageType = 'png';

    const imagePath = path.join(__dirname, '../../pictures/grades/');
    var optionalObj = {fileName: fileName, 'type':imageType};
    base64ToImage(imageData, imagePath, optionalObj);
    return fileName+'.'+imageType;
}

exports.createGrade = async (req, res) => {
    const { title,  required_points, picture} = req.body;
    const pictureName =  saveGradeImage(title, picture)
    try {
        const newGrade = await Grade.create({ title, required_points, picture:pictureName});
        res.status(201).json(newGrade);
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la création du grade:', error);
        res.status(500).json({ message: 'Une erreur s\'est produite lors de la création du grade' });
    }
};

exports.updateGrade = async (req, res) => {
    const gardeId = req.params.id;
    const { title, required_points, picture } = req.body;
    const pictureName =  saveGradeImage(title, picture)
    try {
        const grade = await Grade.findByPk(gradeId);
        if (grade) {
            await grade.update({ title, required_points,  picture:pictureName });
            res.json(grade);
        } else {
            res.status(404).json({ message: 'grade non trouvé' });
        }
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la mise à jour du grade:', error);
        res.status(500).json({ message: 'Une erreur s\'est produite lors de la mise à jour du grade' });
    }
};

// Méthode pour supprimer un GRADE
exports.deleteGrade = async (req, res) => {
    const gradeId = req.params.id;
    try {
        const grade = await Grade.findByPk(gradeId);
        if (grade) {
            await grade.destroy();
            res.json({ message: 'grade supprimé avec succès' });
        } else {
            res.status(404).json({ message: 'grade non trouvé' });
        }
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la suppression du grade:', error);
        res.status(500).json({ message: 'Une erreur s\'est produite lors de la suppression du grade' });
    }
};
