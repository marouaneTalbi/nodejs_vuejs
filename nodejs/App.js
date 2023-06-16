
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
