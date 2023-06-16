const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

  exports.register = async (req, res) => {
    try {
      const { mail, password, pseudo } = req.body;
      const existingUser = await User.findOne({ where: { mail } });
      if (existingUser) {
        return res.status(409).json({ message: 'L\'utilisateur existe déjà' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({ mail, password: hashedPassword, pseudo: pseudo });
      const token = jwt.sign({ id: newUser.id }, 'secretKey');
      res.json({ token });
    } catch (error) {
      res.status(500).json({ message: `Une erreur s'est produite lors de l'inscription : ${error.message}` });
    }
  };