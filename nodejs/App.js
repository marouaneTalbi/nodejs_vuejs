const express = require('express');
const dotenv = require('dotenv');
dotenv.config({path:'./config/config.env'});
require('./config/conn');

const app = express();
const route = require('./routes/userRoute');
const userModel = require("./models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//Using express.json to get request of json data
app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.use('/api', route);
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.get('/login', (req, res) => {
    res.send(`
    <h1>Formulaire de connexion</h1>
    <form method="POST" action="/api/login" enctype="application/x-www-form-urlencoded">
      <input type="email" name="email" placeholder="Adresse e-mail" required><br>
      <input type="password" name="password" placeholder="Mot de passe" required><br>
      <button type="submit">Se connecter</button>
    </form>
  `);
});

app.get('/register', (req, res) => {
    res.send(`
    <h1>Formulaire d'inscription</h1>
    <form method="POST" action="/api/login" enctype="application/json">
      <input type="text" name="nom" placeholder="Nom" required><br>
      <input type="email" name="email" placeholder="Adresse e-mail" required><br>
      <input type="password" name="password" placeholder="Mot de passe" required><br>
      <button type="submit">S'inscrire</button>
    </form>
  `);
});
app.listen(process.env.PORT, () => {
    console.log('Serveur Express en cours d\'exécution sur le port 3000');
});
