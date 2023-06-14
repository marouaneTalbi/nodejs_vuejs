const pool = require('../config/conn.js');

const User = {
    // Méthode pour récupérer tous les utilisateurs
    getAllUsers: (callback) => {
        const query = 'SELECT * FROM user';
        pool.query(query, (err, result) => {
            if (err) {
                console.error('Erreur lors de la récupération des utilisateurs :', err);
                callback(err, null);
            } else {
                callback(null, result.rows);
            }
        });
    },

    // Méthode pour créer un nouvel utilisateur
    createUser: (username, email, callback) => {
        const query = 'INSERT INTO user (username, email) VALUES ($1, $2) RETURNING *';
        const values = [username, email];
        pool.query(query, values, (err, result) => {
            if (err) {
                console.error('Erreur lors de la création de l\'utilisateur :', err);
                callback(err, null);
            } else {
                callback(null, result.rows[0]);
            }
        });
    },

    // Méthode pour récupérer un utilisateur par son ID
    getUserById: (userId, callback) => {
        const query = 'SELECT * FROM user WHERE id = $1';
        const values = [userId];
        pool.query(query, values, (err, result) => {
            if (err) {
                console.error('Erreur lors de la récupération de l\'utilisateur :', err);
                callback(err, null);
            } else {
                callback(null, result.rows[0]);
            }
        });
    },

    // Méthode pour mettre à jour un utilisateur
    updateUser: (userId, username, email, callback) => {
        const query = 'UPDATE user SET username = $1, email = $2 WHERE id = $3 RETURNING *';
        const values = [username, email, userId];
        pool.query(query, values, (err, result) => {
            if (err) {
                console.error('Erreur lors de la mise à jour de l\'utilisateur :', err);
                callback(err, null);
            } else {
                callback(null, result.rows[0]);
            }
        });
    },

    // Méthode pour supprimer un utilisateur
    deleteUser: (userId, callback) => {
        const query = 'DELETE FROM user WHERE id = $1';
        const values = [userId];
        pool.query(query, values, (err) => {
            if (err) {
                console.error('Erreur lors de la suppression de l\'utilisateur :', err);
                callback(err);
            } else {
                callback(null);
            }
        });
    },

    findOne: (userEmail, callback) => {
        const query = 'SELECT * FROM user WHERE mail = $1';
        const values = [userEmail];
        pool.query(query, values, (err, result) => {
            if (err) {
                console.error('Erreur lors de la récupération de l\'utilisateur :', err);
                callback(err, null);
            } else {
                callback(null, result.rows[0]);
            }
        });
    }

};

module.exports = User;
