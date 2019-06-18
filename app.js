// **********************************
// Setup for request handlers
// **********************************

// Express setup
const express = require('express');
const app = express();
// morgan helps display better logs in the console screen
const morgan = require('morgan');
// Body parser for sending data to the server without using the url parameters
const bodyParser = require('body-parser');
// Mongoose for interacting with db
const mongoose = require('mongoose');

// Setup routes
// products route
const productsRoutes = require('./api/routes/products');
const ordersRoutes = require('./api/routes/orders');
const userRoute = require('./api/routes/user');

// Connect to db
mongoose
  .connect(
    'mongodb+srv://busola:QhfDZnTLr9XEjp27@cluster0-sbx4y.mongodb.net/test?retryWrites=true&w=majority',
    { useNewUrlParser: true }
  )
  .then(data => {
    console.log('Connected to db');
  })
  .catch(err => {
    console.log('not connected to db');
    console.log(err);
  });

// useNewUrlParser: true

// Setup morgan
app.use(morgan('dev'));

// Setup Body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Middleware setup
// Setting up CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE');
    return res.status(200).json({});
  }
  next();
});

app.use('/products', productsRoutes);
app.use('/orders', ordersRoutes);
app.use('/users', userRoute);

// If the requested API is not available
app.use((req, res, next) => {
  // Create an instance of Error
  const error = new Error('Route not found');
  error.status = 404;
  next(error);
});

// Since error has been instantiated in the previous middleware
app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    error: {
      message: error.message
    }
  });
});

// Export module
module.exports = app;
