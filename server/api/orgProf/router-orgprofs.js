'use strict';
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const router = express.Router();
const jsonParser = bodyParser.json();
const jwtAuth = passport.authenticate('jwt', {session: false});

const {OrgProf} = require('./models-orgprofs');
const {User} = require('../users');
const {Position} = require('../positions');


// GET an organization profile

router.get('/:id', jsonParser, jwtAuth, (req, res) => {
  
  OrgProf.findById(req.params.id)
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


router.post('/', jsonParser, jwtAuth, (req, res) => {
  
  // Set required fields, detect missing fields
  const requiredFields = ['name', 'email', 'userAccount'];
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
  const stringFields = ['name', 'website', 'email', 'phone', 'summary',];
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

  // Create new OrgProf
  
  // Extract values from req.body
  let {name, website = '', email, phone = '', summary = '',
       userAccount} = req.body;
  
  name = name.trim();
  website = website.trim();
  email = email.trim();
  phone = phone.trim();
  summary = summary.trim();
  
  // Validate userAccount as User._id, then create user
    User.findById(userAccount)
      .then(
        // Resolve function
        function(user) {
          return OrgProf.create(
            {
              name: name,
              website: website,
              email: email,
              phone: phone,
              summary: summary,
              userAccount: userAccount
            })
            .then(
              // Resolve
              function(orgProf) {
                return res.status(201).json(orgProf);
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