const express = require('express');
const app = express();
const route = require('./routes/userRoute');
const skinRoute = require('./routes/skinRoute');
const User = require("./controllers/UserController")
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const gameSocket = require('./sockets/gameSocket');

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


// MONGODB connection
const mongodb = require('./db/mongo');
mongodb.initClientDbConnection();

// MIDDLEWARE 
app.use(cors());
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

// ROUTES
app.use('/', route);
app.use('/', skinRoute);
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// à mettre dans un autre fichier
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

// CSP configuration
helmet.contentSecurityPolicy({
    connectSrc: ["'self'", 'http://localhost:5173/'],
})

// CORS configuration
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin','*')
    res.setHeader('Cross-Origin-Resource-Policy','*')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    next();
});

// START express server
server.listen('3000', () => {
    console.log('Serveur Express en cours d\'exécution sur le port 3000');
});

