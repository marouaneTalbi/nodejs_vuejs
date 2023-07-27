const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const clientOptions = {
    useNewUrlParser : true,
    dbName : 'memoryGame'
};

exports.initClientDbConnection = async () => {
    try {
        if(process.env.SERVER_URI === 'http://localhost:3000'){ 
            await mongoose.connect(process.env.URL_MONGO, clientOptions)
        }
        await mongoose.connect(process.env.URL_MONGO)
    } catch (error) {
        throw error;
    }
}