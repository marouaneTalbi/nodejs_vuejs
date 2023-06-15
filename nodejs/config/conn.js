module.exports = {
    development: {
        host: 'localhost',
        port: 5432,
        database: 'mydatabase',
        username: 'myuser',
        password: 'mypassword',
        dialect: 'postgres'
    },
  };


//   module.exports = {
//     development: {
//       database: 'your_database',
//       username: 'your_username',
//       password: 'your_password',
//       host: 'localhost',
//       port: 27017,
//       dialect: 'mongodb'
//     },
//     production: {
//       // Configurations pour l'environnement de production
//     }
//   };

// const { Pool } = require('pg');

// const pool = new Pool({
//     host: 'localhost',
//     port: 5432,
//     database: 'mydatabase',
//     user: 'myuser',
//     password: 'mypassword'
// });

// pool.connect((err, client, done) => {
//     if (err) {
//         console.error('Erreur de connexion à la base de données :', err);
//     } else {
//         console.log('Connecté à la base de données PostgreSQL');
//         done();
//     }
// });

// module.exports = pool;