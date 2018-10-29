'use strict';

const express = require('express');
  const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../../../../config');
const { jwtStrategy } = require('../../../api/auth');
  passport.use(jwtStrategy);
const jwtAuth = passport.authenticate('jwt', {session: false});
const bodyParser = require('body-parser');
  const jsonParser = bodyParser.json();
  
const views = require('./views');

// Get request to load an indProf

router.get('/', jwtAuth, (req, res) => {
  
  // Extract query data
  const { mode, userId, profId } = req.query;

  // Select view to return
  if (mode === 'create') {
    
    // Build userData
    const userData = {
      userId: userId
    };
    
    // Send response
    return res.send(views.createMode(userData));
    
  }

});

module.exports = { router };