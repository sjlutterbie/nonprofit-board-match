'use strict';

// Load required modules
const express = require('express');
const morgan = require('morgan');

// Create core app
const app = express();

app.use(morgan('common'));

// Set port information
const { PORT } = require('./config');

// Set up static file route
app.use(express.static('./client/public'));


















// SERVER LAUNCH FUNCTIONS

// Create server object, for global manipulation
let server;

function runServer(port = PORT) {
  return new Promise((resolve, reject) => {
    server = app.listen(port, () => {
      console.log(`Your app is listening on port ${port}`);
      resolve();
    })
    .on('error', err => {
      reject(err);
    });
  });
}

function closeServer() {
  return new Promise((resolve, reject) => {
    console.log('Closing server');
    server.close( err => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}

// If server.js is called directly, launch the server
if (require.main === module) {
  runServer().catch(err => console.error(err));
}

////////////////////////////////////////////////////////////////////////////////

module.exports = {
  runServer,
  closeServer,
  app
};