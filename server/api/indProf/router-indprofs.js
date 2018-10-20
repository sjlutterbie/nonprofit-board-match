'use strict';
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const router = express.Router();
const jsonParser = bodyParser.json();
const jwtAuth = passport.authenticate('jwt', {session: false});


const {IndProf} = require('./models-indprofs');
const {User} = require('../users');



// GET an individual profile

router.get('/:id', jsonParser, jwtAuth, (req, res) => {
  
  IndProf.findById(req.params.id)
    .then(
      // Found profile
      function(prof) {
        res.status(200).json(prof);  
      },
      // Couldn't find profile
      function(err) {
        return res.status(422).json({
          code: 422,
          reason: 'ValidationError',
          message: 'Invalid profile ID'
        });
      }
    );
});

// POST a new individual profile

  // TODO: Creating an indProf should update ref for:
    // userAccount

router.post('/', jsonParser, jwtAuth, (req, res) => {
  
  // Set required fields, detect missing fields
  const requiredFields = ['firstName', 'lastName', 'email', 'userAccount'];
  const missingField = requiredFields.find(field => !(field in req.body));
  
  // Reject request with missing fields
  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    });
  }
  
  // Set string fields, detect non-string fields
  const stringFields = ['firstName', 'lastName', 'email', 'phone', 'linkedIn'];
  const nonStringField = stringFields.find(field => 
    (field in req.body && typeof req.body[field] !== 'string'));
  
  // Reject request with non-string fields
  if (nonStringField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Non-string field',
      location: nonStringField
    });
  }

  // Create new IndProf
  
  // Extract values from req.body
  let {firstName, lastName, email, 
       userAccount, phone = '', linkedIn = ''} = req.body;
  
  firstName = firstName.trim();
  lastName = lastName.trim();
  
  // Validate userAccount as User._id, then create user
    User.findById(userAccount)
      .then(
        // Resolve function
        function(user) {
          return IndProf.create(
            {
              firstName: firstName,
              lastName: lastName,
              email: email,
              phone: phone,
              linkedIn: linkedIn,
              userAccount: userAccount
            })
            .then(
              // Resolve
              function(indProf) {
                return res.status(201).json(indProf);
              },
              // Reject
              function(err){
                return res.status(500).json(
                  {code: 500,
                    message: 'Internal server error'
                  }
                );
              }
            );
        },
        // Reject function
        function(err){
          return res.status(422).json({
            code: 422,
            reason: 'ValidatingError',
            message: 'Non-string field',
            location: userAccount
          });
        }
      );

});
  
module.exports = {
  router
};