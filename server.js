'use strict';

// Load required modules
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
  // Use ES6 promises
  mongoose.Promise = global.Promise;
const passport = require('passport');

// Authorization routers
const { router: usersRouter } = require('./server/users');

// Set port & DB information
const { PORT, DATABASE_URL } = require('./config');

// Create core app
const app = express();

app.use(morgan('common'));

// CORS middleware setup
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow_Methods', 'GET, POST, PUT, PATCH, DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});

app.use('/api/users/', usersRouter);

// Set up static file route
app.use(express.static('./client/public'));



// DEVELOPMENT ROUTE FOR TESTING AUTHENTICATION

app.get('/authTest', (req, res) => {
  res.send('Successfully accessed /authTest');
});











// Catch-all endpoint for requests to non-existing endpoints

app.use('*', function(req, res) {
  res.status(404).json({message: 'Not found'});
});

// SERVER LAUNCH FUNCTIONS

// Create server object, for global manipulation
let server;

function runServer(databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
    
      
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close( err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

// If server.js is called directly, launch the server
if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

////////////////////////////////////////////////////////////////////////////////

module.exports = {
  runServer,
  closeServer,
  app
};