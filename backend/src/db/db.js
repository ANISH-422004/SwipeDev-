const mongoose = require('mongoose');
const config = require('../config/config');


module.exports.connectDB = async () => {
    mongoose.connect(config.MONGO_URI).then(() => {
        console.log('MongoDB connected')
    }).catch((err) => {
        console.log('MongoDB connection error:', err)
    }
    )
}
