const express = require('express');
const app = express();
const route = require('./routes/userRoute');
const userModel = require("./models/userModel");
const User = require("./controllers/UserController")
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

app.get('/confirm', async (req, res) => {
    const token = req.query.token;
    try {
        const user = await User.findByToken(token);
        res.send('Votre compte est confirmé');

    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).send('Internal Server Error');
    }
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
