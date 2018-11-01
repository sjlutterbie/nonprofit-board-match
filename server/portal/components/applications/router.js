'use strict';

const express = require('express');
  const router = express.Router();
const passport = require('passport');
// const jwt = require('jsonwebtoken');
// const config = require('../../../../config');
const { jwtStrategy } = require('../../../api/auth');
  passport.use(jwtStrategy);
const jwtAuth = passport.authenticate('jwt', {session: false});
// const bodyParser = require('body-parser');
//  const jsonParser = bodyParser.json();
  
const views = require('./views');
const ctrls = require('./controllers');

const { User } = require('../../../api/users');
const { IndProf } = require('../../../api/indProf')




// GET /apply - Return an Application createMode form

router.get('/apply', jwtAuth, (req, res) => {

  const posId = req.query.posId;

  res.send(views.createMode(posId));

});

////////////////////////////////////////////////////////////////////////////////

module.exports = { router };