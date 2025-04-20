const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');



//middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));


//routes






module.exports = app;