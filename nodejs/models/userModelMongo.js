const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  _id: {
    type: Number,
    required: true,
  },
  pseudo: {
    type: String,
    required: true,
  },
  mail: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  picture: String,
  coins: Number,
  ratio: Number,
  token: String,
  isconfirmed: Boolean,
  points: Number,
  skins_fk_id: Number,
});

const UserMongo = mongoose.model('_user', userSchema);

module.exports = UserMongo;
