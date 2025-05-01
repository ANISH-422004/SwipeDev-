const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const requestRoutes = require('./routes/request.routes');
const connectionRoutes = require('./routes/connection.routes');
const chatRoutes = require('./routes/chat.routes');
const cronJob = require('./utils/CronJob');

//middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));


//routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/requests', requestRoutes);
app.use('/api/v1/connections', connectionRoutes);
app.use('/api/v1/chat', chatRoutes);






module.exports = app;