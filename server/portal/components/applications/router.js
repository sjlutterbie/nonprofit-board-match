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
  const profId= req.query.profId;

  res.send(views.createMode(posId, profId));

});

// GET /viewapp/:id Return a single applicationin staticMode

router.get('/viewapp/:id', jwtAuth, (req, res) => {

  const appId = req.params.id;
  console.log(appId);
  
  let ApplicationPromise =   ctrls.getApplicationPromise(appId);
  
  ApplicationPromise.then(
    function(application) {
      return res.status(200).send(views.staticMode(application));
    },
    function(err) {
      return err;
    }
  );

});

////////////////////////////////////////////////////////////////////////////////

module.exports = { router };