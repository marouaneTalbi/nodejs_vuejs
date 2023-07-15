const mongoose = require('mongoose');
require('dotenv').config();

const clientOptions = {
    useNewUrlParser : true,
    dbName : 'memoryGame'
};

exports.initClientDbConnection = async () => {
    try {
        await mongoose.connect('mongodb://myuser:mypassword@localhost:27017/?authMechanism=DEFAULT', clientOptions)
        // await mongoose.connect('mongodb+srv://myuser:mypassword@clustermongo.xqj9qjx.mongodb.net/?retryWrites=true&w=majority')

        console.log('Connected');
    } catch (error) {
        console.log(error);
        throw error;
    }
}