'use strict';

// Load required modules
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
  // Use ES6 promises
  mongoose.Promise = global.Promise;
const passport = require('passport');

// Routers
const { router: usersRouter } = require('./server/api/users');
const { router: authRouter, localStrategy,
                jwtStrategy } = require('./server/api/auth');
const { router: portalRouter } = require('./server/portal');
const { router: indProfsRouter } = require('./server/api/indProf');
const { router: orgProfsRouter } = require('./server/api/orgProf');
const { router: positionsRouter } = require('./server/api/positions')

// Set port & DB information
const { PORT, DATABASE_URL } = require('./config');

// Create core app
const app = express();

//app.use(morgan('common'));

// CORS middleware setup
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow_Methods', 'GET, POST, PUT, DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use('/api/users/', usersRouter);
app.use('/api/auth', authRouter);
app.use('/portal', portalRouter);
app.use('/api/indprofs', indProfsRouter);
app.use('/api/orgprofs', orgProfsRouter);
app.use('/api/positions', positionsRouter);

const jwtAuth = passport.authenticate('jwt', {session: false});

// Set up static file route
app.use(express.static('./client/public'));



// DEVELOPMENT ROUTE FOR TESTING AUTHENTICATION

app.get('/api/protected', jwtAuth, (req, res) => {
  return res.json({
    data: 'Welcome, friend!'
  });
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
    const connectOpts = {useNewUrlParser: true};
    mongoose.connect(databaseUrl, connectOpts, err => {
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
// Otherwise, handle like a module (for TDD purposes)
}

////////////////////////////////////////////////////////////////////////////////

module.exports = {
  runServer,
  closeServer,
  app
};  
