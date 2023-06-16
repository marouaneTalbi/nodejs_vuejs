
const express = require('express');
// const dotenv = require('dotenv');
// dotenv.config({path:'./config/config.env'});
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
const app = express();
const route = require('./routes/userRoute');
const userModel = require("./models/userModel");
const sequelize = require('./config/conn');

app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.use('/', route);
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.get('/login', (req, res) => {
    res.send(`
    <h1>Formulaire de connexion</h1>
    <form method="POST" action="/login" enctype="application/x-www-form-urlencoded">
      <input type="mail" name="mail" placeholder="Adresse e-mail" required><br>
      <input type="password" name="password" placeholder="Mot de passe" required><br>
      <button type="submit">Se connecter</button>
    </form>
  `);
});

app.get('/register', (req, res) => {
    res.send(`
    <h1>Formulaire d'inscription</h1>
    <form method="POST" action="/register" enctype="application/json">
      <input type="text" name="pseudo" placeholder="pseudo" required><br>
      <input type="mail" name="mail" placeholder="Adresse e-mail" required><br>
      <input type="password" name="password" placeholder="Mot de passe" required><br>
      <button type="submit">S'inscrire</button>
    </form>
  `);
});


app.listen('3000', () => {
    console.log('Serveur Express en cours d\'exécution sur le port 3000');
});
