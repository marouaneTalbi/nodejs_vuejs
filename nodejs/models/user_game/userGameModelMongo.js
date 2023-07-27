const mongoose = require('mongoose');

const userGameSchema = new mongoose.Schema({
    user_id: {
        type: Number,
        required: true,
    },
    game_id: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    result: {
        type: String,
        required: false
    },
    pointswin: {
        type: Number,
        required: false
    },
    gamemode: {
        type: String,
        required: true
    }
});
userGameSchema.index({ user_id: 1, game_id: 1 }, { unique: true });

const UserGameMongo = mongoose.model('user_game', userGameSchema);

module.exports = UserGameMongo;
