'use strict';

const express = require('express');
  const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../../config');

const { jwtStrategy } = require('../api/auth');

passport.use(jwtStrategy);

const jwtAuth = passport.authenticate('jwt', {session: false});

// Get request to load portal
router.get('/', jwtAuth, (req, res) => {
  return res.json({
    data: 'Welcome, friend, to the Portal!'
  });
});


module.exports = {
  router
};