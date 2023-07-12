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
const bodyParser = require('body-parser');
app.use(express.urlencoded({ extended: true, limit: "200mb" }));
app.use(express.json({ limit: '50mb' }));

app.use('/pictures', express.static(path.join(__dirname, 'pictures')));

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
// SOCKET.IO //




// app.use(express.urlencoded({extended: false}))
// app.use(express.json());

app.use(helmet());


app.use(cors());
app.use('/', route);
app.use('/', skinRoute);
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

// app.use(cookieParser());
// app.use(session({
//     secret: 'secretKey',
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//         httpOnly: true,
//         secure: true,
//         maxAge: 7 * 24 * 60 * 60 * 1000
//     }
// }));


// app.use(express.urlencoded({ extended: true, limit: "200mb" }));
// app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
// app.use(express.json({ limit: '50mb' }));



server.listen('3000', () => {
    console.log('Serveur Express en cours d\'exécution sur le port 3000');
});

io.on('connection', (socket) => {
    gameSocket(socket);
});
