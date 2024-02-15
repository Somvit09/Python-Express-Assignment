const mongoose = require('mongoose');
require("dotenv")

const DB_CONNECTION_STRING = process.env.MONGODB_URI;

mongoose.connect(DB_CONNECTION_STRING, {}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});

module.exports = mongoose;
