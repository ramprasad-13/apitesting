const mongoose = require('mongoose');
require('dotenv').config();

const url = process.env.MONGO_URL;

const db = async () => {
    try {
        await mongoose.connect(url);
        console.log('Connection established successfully');
    } catch (error) {
        console.error(`Failed to connect to DB: ${error.message}`);
    }
};

module.exports = db;
