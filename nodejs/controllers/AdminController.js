const UserMongo = require('../models/userModelMongo');

exports.getUsers = async (req, res) => {
    try {
        const users = await UserMongo.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Une erreur s\'est produite lors de la récupération des utilisateurs' });
    }
};