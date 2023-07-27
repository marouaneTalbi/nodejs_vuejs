const User = require('../models/userModel');
const UserMongo = require('../models/userModelMongo');
const UserGameMongo = require('../models/user_game/userGameModelMongo');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const mailSender = require('../SMTP/mailsender');
const Skin = require('../models/skin/SkinModel');
const authMiddleware = require("../middlewares/authMiddleware");
const UserService = require('../services/userService');
const Grade = require('../models/grade/GradeModel');
const { Op } = require('sequelize');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error('Une erreur s\'est produite lors de la récupération des utilisateurs:', error);
    res.status(500).json({ message: 'Une erreur s\'est produite lors de la récupération des utilisateurs' });
  }
};

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

exports.updateUser = async (req, res) => {
  const userId = req.params.id;
  const { pseudo, mail } = req.body;
  try {
    const user = await User.findByPk(userId);
    if (user) {
      if (mail && mail !== user.mail) {
        const code = Math.floor(1000 + Math.random() * 9000);
        req.session.emailVerificationcode = code;
        await mailSender.sendCodeEmail(mail, code);
        if (pseudo === ""){
          await user.update({ mail, isconfirmed:false, verificationcode:code});
        }
        else{
          await user.update({pseudo, mail, isconfirmed:false, verificationcode:code});
        }
      }else{
        if (mail === ""){
          await user.update({pseudo, isconfirmed:true})
        }
        else {
          await user.update({pseudo, mail, isconfirmed:true});
        }
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
      const passwordRegex = /^(?=.*\d)(?=.*[A-Z]).{6,}$/;
      if (!passwordRegex.test(password)) {
        res.status(400).json({ message: 'Mot de passe invalide. Il doit comporter au moins 6 caractères, une majuscule et un chiffre.' });
        return;
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const buffer = crypto.randomBytes(32).toString('hex');
      try {
      const newUser = await User.create({ mail, password: hashedPassword, pseudo: pseudo, token:buffer, createdat: new Date(),coins:100, points: 1000, grade_id: 1 });
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

exports.resendMail = async (req,res) => {
  const email = req.body.email
  try {
    const existingUser = await User.findOne({ where: { mail : email } });
    if (existingUser) {
      if (existingUser.isconfirmed===false){
        const newToken = crypto.randomBytes(32).toString('hex');
        await existingUser.update({ token:newToken});
        await mailSender.sendConfirmationEmail(email, newToken);
        res.status(200).json(existingUser)
      }
      else {
        res.status(400).json({ message: 'Votre compte est déja confirmé' });
      }
    }else{
      res.status(400).json({ message: 'cette adresse email est pas encore inscrit' });
    }
  }catch (error){
    console.error('An error occurred:', error);
    res.status(500).send('Internal Server Error');
  }
}

exports.confirm = async (req, res) => {
  const token = req.body.token;
  try {
    const user = await User.findOne({
      where: {
        token: token
      }
    });
    if (!user) {
      return res.status(400).json({ message: 'Token invalide' });
    }
    user.isconfirmed = true;
    await user.save();
    await mailSender.sendWelcomEmail(user.mail);
    res.send('Votre compte est confirmé');
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).send('Internal Server Error');
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

exports.updateIsConfirmed = async (req,res) => {
  const userId = req.params.id;
  const code = parseInt(req.body.code);
  try {
    const user = await User.findByPk(userId);
    const emailVerificationcode = user.verificationcode;
    if (user) {
      if (code === emailVerificationcode) {
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

  try {    
    return res.json(user);
  } catch (error) {
    console.error('Une erreur s\'est produite lors de la récupération du current user :', error);
    return res.status(500).json({ message: 'Une erreur s\'est produite lors de la récupération du current user' });
  }
}
  
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

exports.forgotPassword = async (req, res) => {
  try {
    const { mail } = req.body;
    const existUser = await User.findOne({ where: { mail } });
    if (existUser) {
      const token = jwt.sign({ id: existUser.id }, 'secretKey');
      await existUser.update({forgot_pwd:token});
      await mailSender.sendForgotPassword(existUser.mail, token)
      res.status(409).json({ message: 'Utilisateur trouvé' });
    }else {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Une erreur s\'est produite lors de le recuperation du mdp' });
  }
};

exports.initPassword = async (req, res) => {
  try {
    const { password, token } = req.body;
    const existUser = await User.findOne({ where: { forgot_pwd:token } });
    if (existUser) {
      existUser.password = await bcrypt.hash(password, 10);
      await existUser.save();
      res.json({ message: 'Mot de passe modifié avec succès' });
    }else {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Une erreur s\'est produite lors de le recuperation du mdp' });
  }
};

exports.getUserStats = async (req, res) => {
  try {
    const userId = req.params.id;
    const stats = await UserService.getUserStats(userId);

    res.json({ stats });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}

exports.getUserGamesHistory = async (req, res) => {
  try {

    const userId = req.params.id;
    const query = {
      user_id: userId,
      result: { $ne: null }
    };
    const userGamesHistory = await UserGameMongo.find(query);
    
    res.status(200).json(userGamesHistory);

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });

  }
};

exports.getUserGrade = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);
    if(!user) {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    const grade = await Grade.findByPk(user.grade_id);
    if(!grade) {
      res.status(404).json({ message: 'Grade non trouvé' });
    }

    return res.status(200).json({ grade });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

exports.updateUserGrade = async (user) => {
  try {
    const currentGrade = await Grade.findByPk(user.grade_id);
    const newGrade = await Grade.findOne({
      where: {
        required_points: {
          [Op.lte]: user.points, // Find the grade where requiredPoints is less than or equal to the user's points
        },
      },
      order: [['required_points', 'DESC']], // Order by requiredPoints in descending order to get the highest grade that the user qualifies for
    });

    if (!newGrade) {
      // If there's no new grade, set the user's grade to null (unranked)
      // await user.setGrade(null);
    } else if (!currentGrade || newGrade.id !== currentGrade.id) {
      // If the user's grade has changed, update the gradeId of the user
      await user.setGrade(newGrade);
    }

    user.save();

  } catch(error) {
    return res.status(500).json({ message: 'Server error' })
  }
}