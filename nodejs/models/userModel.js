const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'localhost',
  port: 5432,
  database: 'mydatabase',
  username: 'myuser',
  password: 'mypassword'
});

const User = sequelize.define('_user', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  pseudo: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  mail: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  picture: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  coins: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  ratio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  token: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isconfirmed: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  },
  points: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  skins_fk_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Skin',
      key: 'id'
    }
  }
}, {
  tableName: '_user',
  timestamps: false
});

module.exports = User;
