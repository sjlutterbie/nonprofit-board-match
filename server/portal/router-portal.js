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
const ctrls = require('./controllers-portal');


// Get request to load portal
router.get('/', jwtAuth, (req, res) => {

  // Extract arguments for portalBuilder
  const profType = req.query.profType
  const profId = req.query.profId
  const userId = req.user.userId
  
  // Select which Portal View to build
  
  const viewType = ctrls.portalBuildSelector(profType, profId);

  // NOTE: Function Arguments used for dev purposes
  return res.send(portalView(profType, profId, userId, viewType));

  
});


module.exports = {
  router
};