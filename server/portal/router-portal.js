'use strict';

const express = require('express');
  const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../../config');
const { jwtStrategy } = require('../api/auth');
  passport.use(jwtStrategy);
const jwtAuth = passport.authenticate('jwt', {session: false});

// Load View
const { portalView} = require('./view-portal');

// Get request to load portal
router.get('/', jwtAuth, (req, res) => {
  
  return res.send(portalView());
  
  //return res.json({
  //  data: portalView()
  //});
});


module.exports = {
  router
};