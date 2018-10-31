'use strict';

const express = require('express');
  const router = express.Router();
const passport = require('passport');
// const jwt = require('jsonwebtoken');
const config = require('../../config');
const { jwtStrategy } = require('../api/auth');
  passport.use(jwtStrategy);
const jwtAuth = passport.authenticate('jwt', {session: false});
const bodyParser = require('body-parser');
  const jsonParser = bodyParser.json();

// Load View
const portal = require('./portal');
const indProf = require('./components/indprof');

// Get request to load portal
router.get('/', jwtAuth, (req, res) => {

  // Extract arguments for portalBuilder
  const userType = req.query.userType;
  const profId = req.query.profId;
  const userId = req.user.userId;
  
  let indProfPromise = indProf.getIndProfPromise(profId);
  
  indProfPromise.then(
    function(profile) {
      return res.send(portal.buildPortal(userType, profId, userId, profile));
    },
    function(err) {
      return err;
    }
  );

});

///////////////////////////////////////////////////////////////////////////////

module.exports = {
  router
};