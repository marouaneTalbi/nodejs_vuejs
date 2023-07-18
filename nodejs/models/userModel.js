const { Sequelize, DataTypes } = require('sequelize');
const UserMongo = require('./userModelMongo');
const Skin = require('./skin/SkinModel');
const UserSkin = require('./user_skin/user_skin');

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'localhost',            
  port: 5432,
  database: 'mydatabase',
  username: 'myuser',
  password: 'mypassword',
  timestamps:false
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
    allowNull: false,
    defaultValue: 'picture.png',
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
  },
  createdat: {

    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  role: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'gamer',
  },
  verificationcode: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  forgot_pwd: {
    type: DataTypes.STRING(255),
    allowNull: true,
  }
}, {
  tableName: '_user',
  timestamps: false,
  subQuery: false
});

Skin.belongsToMany(User, { through: 'user_skin', foreignKey: 'skin_id' });
User.belongsToMany(Skin, { through: 'user_skin', foreignKey: 'user_id' });

User.afterCreate(async (user, options) => {
  try {
    await UserMongo.create({
      _id: user.id, 
      pseudo: user.pseudo, 
      mail: user.mail, 
      password: user.password,
      createdat: user.createdat
    })
    console.log('User creation in MongoDB successful');
  } catch (error) {
    console.error('An error occurred after user deletion in MongoDB:', error);
  }
})

User.afterUpdate(async (user, options) => {
  try {
    const changedFields = user.changed();

    changedFields.map(async (field) => {
      const updateObj = {};
      updateObj[field] = user[field];
      await UserMongo.findByIdAndUpdate(user.id, updateObj);
    })

  } catch (error) {
    console.error('An error occurred after user deletion in MongoDB:', error);
  }
})
module.exports = User;
