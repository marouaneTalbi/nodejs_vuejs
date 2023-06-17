const express = require('express');
const app = express();
const route = require('./routes/userRoute');
const userModel = require("./models/userModel");
const sequelize = require('./config/conn');
const helmet = require('helmet');
const cors = require('cors');
app.use(cors());
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.use('/', route);
app.get('/', (req, res) => {
    res.send('Hello, World!');
});
app.get('/register', (req, res) => {
    res.send(`
    <h1>Inscription</h1>
    <form action="/register" method="POST">
      <label for="pseudo">Pseudo:</label>
      <input type="text" id="pseudo" name="pseudo" required><br><br>
    
      <label for="mail">Email:</label>
      <input type="email" id="mail" name="mail" required><br><br>
    
      <label for="password">Mot de passe:</label>
      <input type="password" id="password" name="password" required><br><br>
    
      <input type="submit" value="S'inscrire">
    </form>
  `);
});

app.get('/login', (req, res) => {
    res.send(`
    <h1>Inscription</h1>
    <form action="/login" method="POST">
      <label for="mail">Email:</label>
      <input type="email" id="mail" name="mail" required><br><br>
    
      <label for="password">Mot de passe:</label>
      <input type="password" id="password" name="password" required><br><br>
    
      <input type="submit" value="Se connecter">
    </form>
  `);
});

helmet.contentSecurityPolicy({
  connectSrc: ["'self'", 'http://localhost:5173/'],
})

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin','*')
  res.setHeader('Cross-Origin-Resource-Policy','*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.listen('3000', () => {
    console.log('Serveur Express en cours d\'exécution sur le port 3000');
});
