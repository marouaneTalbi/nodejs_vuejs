const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    report: Boolean,
    user_id:{
        type: Number,
        required: true,
    }
});

const ChatMongo = mongoose.model('chat', chatSchema);

module.exports = ChatMongo;
