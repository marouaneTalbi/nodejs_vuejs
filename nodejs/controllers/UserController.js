const User = require('../models/userModel');
const UserMongo = require('../models/userModelMongo');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const mailSender = require('../SMTP/mailsender');
const Skin = require('../models/skin/SkinModel');


// Méthode pour récupérer tous les utilisateurs
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error('Une erreur s\'est produite lors de la récupération des utilisateurs:', error);
    res.status(500).json({ message: 'Une erreur s\'est produite lors de la récupération des utilisateurs' });
  }
};

// Méthode pour récupérer un utilisateur par son ID
exports.getUserById = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findByPk(userId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
  } catch (error) {
    console.error('Une erreur s\'est produite lors de la récupération de l\'utilisateur:', error);
    res.status(500).json({ message: 'Une erreur s\'est produite lors de la récupération de l\'utilisateur' });
  }
};

// Méthode pour créer un nouvel utilisateur
exports.createUser = async (req, res) => {
  const { pseudo, mail, password } = req.body;
  try {
    const newUser = await User.create({ pseudo, mail, password });
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Une erreur s\'est produite lors de la création de l\'utilisateur:', error);
    res.status(500).json({ message: 'Une erreur s\'est produite lors de la création de l\'utilisateur' });
  }
};

// Méthode pour mettre à jour les informations d'un utilisateur
exports.updateUser = async (req, res) => {
  const userId = req.params.id;
  const { pseudo, mail, password } = req.body;
  try {
    const user = await User.findByPk(userId);
    if (user) {
      await user.update({ pseudo, mail, password });
      res.json(user);
    } else {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
  } catch (error) {
    console.error('Une erreur s\'est produite lors de la mise à jour de l\'utilisateur:', error);
    res.status(500).json({ message: 'Une erreur s\'est produite lors de la mise à jour de l\'utilisateur' });
  }
};

// Méthode pour supprimer un utilisateur
exports.deleteUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findByPk(userId);
    if (user) {
      await user.destroy();
      res.json({ message: 'Utilisateur supprimé avec succès' });
    } else {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
} catch (error) {
    console.error('Une erreur s\'est produite lors de la suppression de l\'utilisateur:', error);
    res.status(500).json({ message: 'Une erreur s\'est produite lors de la suppression de l\'utilisateur' });
  }
};


exports.login = async (req, res) => {
    try {
      const { mail, password } = req.body;
      const user = await User.findOne({ where: { mail } });
      if (user) {
        if (!user.isconfirmed) {
          res.status(401).json({ message: 'Utilisateur non confirmé' });
          return;
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
          const token = jwt.sign({ id: user.id }, 'secretKey');
          res.json({ token });
        } else {
          res.status(401).json({ message: 'Mot de passe incorrect' });
        }
      } else {
        res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
    } catch (error) {
      res.status(500).json({ message: `Une erreur s'est produite lors de la connexion : ${error.message}` });
    }
  }

exports.logout = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, 'secretKey', (err, decoded) => {
    if (err) {

      return res.status(401).json({ message: 'Invalid token' });
    } else {
      return res.status(200).json({ message: 'Logout successful' });
    }
  });
};


exports.register = async (req, res) => {
    try {
      const { pseudo, mail, password } = req.body;

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(mail)) {
        res.status(400).json({ message: 'Adresse e-mail invalide' });
        return;
      }
      const existingUser = await User.findOne({ where: { mail } });
      if (existingUser) {
        res.status(409).json({ message: 'Adresse e-mail déjà existante' });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const buffer = crypto.randomBytes(32).toString('hex');
      try {
      const newUser = await User.create({ mail, password: hashedPassword, pseudo: pseudo, token:buffer, created_at: new Date() });

      console.log(newUser.token, newUser.mail)
      await mailSender.sendConfirmationEmail(newUser.mail, newUser.token);
      const token = jwt.sign({ id: newUser.id }, 'secretKey');
      res.json({ token });
      } catch (error) {
        console.error('Une erreur s\'est produite lors de l\'enregistrement de l\'utilisateur:', error);
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription :', error);
      res.status(500).json({ message: 'Une erreur s\'est produite lors de l\'inscription' });
    }
  };

exports.findByToken = async (confirmationToken) => {
  try {
    const user = await User.findOne({
      where: {
        token: confirmationToken
      }
    });

    if (!user) {
      throw new Error('Invalid token');
    }

    user.isconfirmed = true;
    await user.save();

    return user;
  } catch (error) {
    console.error('An error occurred while searching for the user by token:', error);
    throw error;
  }
};

exports.getOne = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await User.findOne({ where: { id: parseInt(id, 10) } });
    if (result) res.json(result);
    else res.sendStatus(404);
  } catch (err) {
    next(err);
  }
};

exports.getUserSkins = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findByPk(userId);
    if (user) {
      const skins = await user.getSkins();
      res.json(skins);
    } else {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
  } catch (error) {
    console.error('Une erreur s\'est produite lors de la récupération des skins de l\'utilisateur:', error);
    res.status(500).json({ message: 'Une erreur s\'est produite lors de la récupération des skins de l\'utilisateur' });
  }
};

  
exports.getUserSkin = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    const skinId = user.skins_fk_id
    const skin = await Skin.findByPk(skinId)

    res.json(skin);
  } catch (error) {
    console.error('Une erreur s\'est produite lors de la récupération des skins de l\'utilisateur:', error);
    res.status(500).json({ message: 'Une erreur s\'est produite lors de la récupération des skins de l\'utilisateur' });
  }
};
