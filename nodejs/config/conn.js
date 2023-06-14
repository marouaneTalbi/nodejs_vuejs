const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'ChallengeStack',
    user: 'root',
    password: 'password1234'
});

pool.connect((err, client, done) => {
    if (err) {
        console.error('Erreur de connexion à la base de données :', err);
    } else {
        console.log('Connecté à la base de données PostgreSQL');
        done();
    }
});

module.exports = pool;