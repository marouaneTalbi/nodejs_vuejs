const UserMongo = require('../models/userModelMongo');
const User = require('../models/userModel');
const { v4: uuidv4 } = require('uuid');
var base64ToImage = require('base64-to-image');
const path = require('path');


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

function saveUserImage(imageTitle, imageData) {
    const fileName = uuidv4()+ '_' +imageTitle
    const imageType = 'png';
  
    const imagePath = path.join(__dirname, '../pictures/skins/');
    var optionalObj = {fileName: fileName, 'type':imageType};
    base64ToImage(imageData, imagePath, optionalObj); 
    return fileName+'.'+imageType;
  }

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        Object.assign(user, updates);

        await user.save();

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'utilisateur' });
    }
};

exports.updateUserPicture = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const user = await User.findByPk(id);


        if(updates.picture) {
            const pictureName = saveUserImage(user.psuedo, updates.picture)
            await user.update({picture:pictureName});
        } else {
            return res.status(404).json({ message: 'Erreur lors du changement de photo' });
        }

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'utilisateur' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        const deletedUser = await User.destroy({
            where: { id: userId },
        });

        if (deletedUser === 0) {
            return res.status(404).json({ message: 'L\'utilisateur n\'existe pas' });
        }

        // à mettre dans hook à l'avenir
        const deleteMongoUser = await UserMongo.findOneAndDelete({ _id: userId });

        res.status(204).json({ });
        
    } catch (error) {
        res.status(500).json({ message: 'Une erreur s\'est produite lors de la suppression de l\'utilisateur' });
    }
}

