const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'localhost',
  port: 5432,
  database: 'mydatabase',
  username: 'myuser',
  password: 'mypassword',
  timestamps:false
});
const UserSkin = sequelize.define('user_skin', {

    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'User',
          key: 'id'
        }
      },

      skin_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Skin',
          key: 'id'
        }
      },

}, {
    tableName: 'user_skin',
    timestamps: false // Désactiver les timestamps pour ce modèle
  });

module.exports = UserSkin;



  
  
  
  
  