const { Sequelize, DataTypes, Op } = require('sequelize');
const UserMongo = require('./userModelMongo');
const Skin = require('./skin/SkinModel');
const UserSkin = require('./user_skin/user_skin');
const Grade = require('./grade/GradeModel');
const path = require('path');
const { sequelize } = require('./sequilize');

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
  grade_id: {
    type: DataTypes.STRING(50),
    allowNull: false,
    references: {
      model: 'Grade',
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

Skin.belongsToMany(User, { through: 'user_skin', foreignKey: 'skin_id', onDelete: 'CASCADE' });
User.belongsToMany(Skin, { through: 'user_skin', foreignKey: 'user_id', onDelete: 'CASCADE' });
User.belongsTo(Grade, {
  foreignKey: 'grade_id',
  onDelete: 'CASCADE'
});

User.afterCreate(async (user, options) => {
  try {
    await UserMongo.create({
      _id: user.id, 
      pseudo: user.pseudo, 
      mail: user.mail, 
      createdat: user.createdat,
      coins: user.coins,
      role: user.role,
      picture: user.picture,
      ratio: user.ratio,
      password: user.password,
    })
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


User.prototype.updateGrade = async function () {
  try {
    // Replace "X" with the minimum points required to gain a new grade
    const X = 1000; // Example: 1000 points required to gain a new grade

    // Get the current user's grade
    const currentGrade = await this.getGrade();
    
    // Get the new grade based on points
    const newGrade = await Grade.findOne({
      where: {
        required_points: {
          [Op.lte]: this.points, // Find the grade where pointsRequired is less than or equal to the user's points
        },
      },
      order: [['required_points', 'DESC']], // Order by pointsRequired in descending order to get the highest grade that the user qualifies for
    });

    if (!newGrade) {
      // If there's no new grade, set the user's grade to null (unranked)
      this.setGrade(null);
    } else if (!currentGrade || newGrade.id !== currentGrade.id) {
      // If the user's grade has changed, update the gradeId of the user
      this.setGrade(newGrade);
    }

    await this.save(); // Save the changes to the database

  } catch (error) {
    console.error('Error updating user grade:', error);
    throw error;
  }
};
module.exports = User;
