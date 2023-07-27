const express = require('express');
const app = express();

// ROUTING
const route = require('./routes/userRoute');
const skinRoute = require('./routes/skinRoute');
const gameRoute = require('./routes/gameRoute');
const gradeRoute = require('./routes/gradeRoute');
const userGameRoute = require('./routes/userGameRoute');

const User = require("./controllers/UserController")
const helmet = require('helmet');
const cors = require('cors');
const gameSocket = require('./sockets/gameSocket');
const sequelize = require('./config/conn');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const https = require('https');

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
/*const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/challenge.ovh/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/challenge.ovh/fullchain.pem'),
};

const server = https.createServer(options, app);
*/
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

// ROUTES
app.use('/', route);
app.use('/', skinRoute);
app.use('/', gameRoute);
app.use('/', gradeRoute)
app.use('/', userGameRoute);
// CSP configuration


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin','*')
    res.setHeader('Cross-Origin-Resource-Policy','*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    next();
  });


// START express server
server.listen('3000', () => {
    console.log('Serveur Express en cours d\'exécution sur le port 3000');
});

module.exports = app;