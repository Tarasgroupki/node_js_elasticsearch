const express = require('express');

const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const elastic = require('./lib/elasticsearch');

// const authRoutes = require('./routes/api/auth');
const ordersRoutes = require('./routes/api/orders');
const usersRoutes = require('./routes/api/users');

elastic.info()
    .then(response => console.log(response))
    .catch(error => console.error(error));

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({
      message: 'It works!',
    });
  }
  next();
});

// Routes which should handle requests
// app.use('/api/auth', authRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/users', usersRoutes);

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  console.log(error);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
