const express = require('express');
const app = express();
const route = require('./routes/userRoute');
const skinRoute = require('./routes/skinRoute');
const User = require("./controllers/UserController")
const helmet = require('helmet');
const cors = require('cors');
const gameSocket = require('./sockets/gameSocket');
const sequelize = require('./config/conn');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');

app.use(express.urlencoded({ extended: false, limit: "200mb" }));
app.use(express.json({ limit: '50mb' }));
app.use('/pictures', express.static(path.join(__dirname, 'pictures')));


app.use(session({
    secret: 'secretKey',
    resave: true,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000
    }
}));
app.use(cookieParser());


// MONGODB CONNECTION //
const mongodb = require('./db/mongo');
mongodb.initClientDbConnection();
// MONGODB CONNECTION //

// SOCKET.IO //
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {

        origins: ['http://localhost:8080']
    }
});
io.on('connection', (socket) => {
    gameSocket(socket);
});
// SOCKET.IO //


// MIDDLEWARE 
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended: false}))

// ROUTES
app.use('/', route);
app.use('/', skinRoute);
// CSP configuration



app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin','*')
    res.setHeader('Cross-Origin-Resource-Policy','*')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    next();
  });

helmet.contentSecurityPolicy({
    connectSrc: ["'self'", 'http://localhost:5173/'],
  })


// START express server
server.listen('3000', () => {
    console.log('Serveur Express en cours d\'exécution sur le port 3000');
});

