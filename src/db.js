const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        console.log('Already connected to MongoDB');
        return;
    }

    try {
        await mongoose.connect('mongodb://hostnameOfMongo.example.com:27017', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        isConnected = true;
        console.log('Connected to MongoDB Atlas...');
    } catch (err) {
        console.error('Failed to connect to MongoDB Atlas:', err);
        process.exit(1); // Stop the app if connection fails
    }
};

module.exports = connectDB;
