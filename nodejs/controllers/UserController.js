const User = require('../models/userModel');
const UserMongo = require('../models/userModelMongo');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const mailSender = require('../SMTP/mailsender');
const session = require('express-session');

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
  const { pseudo, mail } = req.body;
  try {
    const user = await User.findByPk(userId);
    if (user) {
      if (mail && mail !== user.mail) {
        const code = Math.floor(1000 + Math.random() * 9000);
        req.session.emailVerificationCode = code;
        await mailSender.sendCodeEmail(mail, code);
        await user.update({pseudo, mail, isconfirmed:false, verificationCode:code});
      }else{
        await user.update({pseudo, mail});
      }
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
          req.session.userId = user.id;
          const token = jwt.sign({ id: user.id , role: user.role }, 'secretKey');
          res.cookie('token', token, { httpOnly: true, secure: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
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
  req.session.destroy((error) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur lors de la déconnexion' });
    } else {
      res.clearCookie('token');
      res.sendStatus(200);
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
      const newUser = await User.create({ mail, password: hashedPassword, pseudo: pseudo, token:buffer, createdAt: new Date() });
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
  console.log(confirmationToken)
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
    console.log(error)
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


exports.updateIsConfirmed = async (req,res) => {
  const userId = req.params.id;
  const code = parseInt(req.body.code);
  try {
    const user = await User.findByPk(userId);
    const emailVerificationCode = user.verificationCode;
    if (user) {
      if (code === emailVerificationCode) {
        user.isconfirmed = true;
        await user.save();
        res.json(user);
      }else {
        res.status(400).json({ message: 'Code de validation incorrect' });
      }
    }
    else {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
  } catch (error) {
    console.error('Une erreur s\'est produite lors de la mise à jour de l\'utilisateur:', error);
    res.status(500).json({ message: 'Une erreur s\'est produite lors de la mise à jour de l\'utilisateur' });
  }
};


exports.changePassword = async (req, res) => {
  console.log("test")
  const userId = req.params.id;
  const { oldPassword, newPassword } = req.body;
  try {
    const user = await User.findByPk(userId);
    if (user) {
      const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isPasswordMatch) {
        return res.status(400).json({ message: 'Ancien mot de passe incorrect' });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();
      res.json({ message: 'Mot de passe modifié avec succès' });
    } else {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
  } catch (error) {
    console.error('Une erreur s\'est produite lors de la modification du mot de passe de l\'utilisateur:', error);
    res.status(500).json({ message: 'Une erreur s\'est produite lors de la modification du mot de passe de l\'utilisateur' });
  }
};



exports.getCurrentUser = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'Token d\'authentification manquant' });
  }
  try {
    const decoded = jwt.verify(token, 'secretKey');
    
    const userId = decoded.id;
    const user = await User.findByPk(userId);
    console.log('usr: ', user);
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }
    
    return res.json(user);
  } catch (error) {
    console.error('Une erreur s\'est produite lors de la récupération du current user :', error);
    return res.status(500).json({ message: 'Une erreur s\'est produite lors de la récupération du current user' });
  }
}


