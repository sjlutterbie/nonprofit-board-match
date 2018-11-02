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

// Get request to load an indProf

router.get('/', jwtAuth, (req, res) => {
  
  // Set required query vars, detect missing vars
  const requiredFields = ['mode', 'userId'];
  const missingField = requiredFields.find(field => !(field in req.query));
  
  // Handle missing fields
  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    });
  }
  
  // Extract query data
  const { mode, userId, profId } = req.query;

  // Verify valid mode value
  if (!['static','edit','create'].includes(mode)){
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Invalid value',
      location: mode
    });
  }
  
  // Verify userId and profId; if successful, return view
  let userIdPromise = User.findById(userId).exec();
  let profIdPromise = IndProf.findById(profId).exec();
  
  Promise.all([userIdPromise, profIdPromise])
    .then(function(results) {
      // Select view to return
      if (mode === 'create') {
        // Build userData
        const userData = {
          userId: userId
        };
        // Send response
        return res.status(200).send(views.createMode(userData));
      }
      
      if (mode === 'static') {
        
        // Get indProf
        let indProfPromise = ctrls.getIndProfPromise(profId);
        
        indProfPromise.then(
         function(profile) {
           return res.status(200).send(views.staticMode(profile));
         },
         function(err) {
           return err;
         }
        );
      }
      
      if (mode === 'edit') {
        
        // Get indProf
        let indProfPromise = ctrls.getIndProfPromise(profId);
        
        indProfPromise.then(
         function(profile) {
           return res.status(200).send(views.editMode(profile));
         },
         function(err) {
           return err;
         }
        );
      }
    })
    .catch(function(err) {
      return res.status(422).json({
        code: 422,
        reason: 'ValidationError',
        message: 'Invalid value',
        location: 'querVals'
      });
    });

});

////////////////////////////////////////////////////////////////////////////////

module.exports = { router };