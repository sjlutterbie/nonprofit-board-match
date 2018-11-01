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
const ctrls = require('./controllers');

// GET request to load all openPositions

router.get('/', jwtAuth, (req, res) => {
  
  // For passing on to Application forms
  const profId = req.query.profId;
  
  let PositionPromise = ctrls.getOpenPositionsPromise();
  
  PositionPromise.then(
    function(positions){
      return res.status(200).send(views.staticMode(positions, profId));
    },
    function(err) {
      return err;
    }
    );

});

////////////////////////////////////////////////////////////////////////////////

module.exports = {
  router
};