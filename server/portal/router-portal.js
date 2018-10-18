'use strict';

const express = require('express');
  const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../../config');
const { jwtStrategy } = require('../api/auth');
  passport.use(jwtStrategy);
const jwtAuth = passport.authenticate('jwt', {session: false});
const bodyParser = require('body-parser');
  const jsonParser = bodyParser.json();

// Load View
const { portalView} = require('./view-portal');

// Get request to load portal
router.get('/', jwtAuth, (req, res) => {

  // Extract arguments for portalBuilder
  const profType = req.query.profType
  const profId = req.query.profId
  
  return res.send(portalView(profType, profId));

  
});


module.exports = {
  router
};