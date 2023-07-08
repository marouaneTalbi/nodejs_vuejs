const express = require('express');
const app = express();
const route = require('./routes/userRoute');
const skinRoute = require('./routes/skinRoute');

const User = require("./controllers/UserController")

const sequelize = require('./config/conn');
const helmet = require('helmet');
const cors = require('cors');

const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');

const gameSocket = require('./sockets/gameSocket');

// SOCKET.IO //
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
      origins: ['http://localhost:8080']
    }
  });
// SOCKET.IO //


// MONGODB CONNECTION //
const mongodb = require('./db/mongo');
mongodb.initClientDbConnection();
// MONGODB CONNECTION //

app.use(helmet());
app.use(cookieParser());
app.use(session({
    secret: 'secretKey',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000
    }
}));

app.use(express.json());
app.use(express.urlencoded({extended: false}))

app.use('/', route);

const corsOptions = {
    origin: 'http://localhost:8080/pictures',
};

app.use(cors(corsOptions));
app.use('/pictures', cors({
    origin: '*'
}), express.static(path.join(__dirname, 'pictures')));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});


app.use('/', skinRoute);

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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  next();
});

server.listen('3000', () => {
    console.log('Serveur Express en cours d\'exécution sur le port 3000');
});

io.on('connection', (socket) => {
    gameSocket(socket);
});
