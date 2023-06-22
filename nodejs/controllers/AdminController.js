const UserMongo = require('../models/userModelMongo');

exports.getUsers = async (req, res) => {
    try {
        const users = await UserMongo.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Une erreur s\'est produite lors de la récupération des utilisateurs' });
    }
};

exports.getUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await UserMongo.findById(userId);

        if(!user) {
            res.status(404).json({ message: 'le User n\'existe pas' })
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Une erreur s\'est produite lors de la récupération des utilisateurs' });
    }
}

