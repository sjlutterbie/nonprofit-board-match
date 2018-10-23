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



// POST: Create a new organization profile

    //TODO: Creating an orgProf should update refs for
      // Relevant userAccount

// PUT: Update an existing organization profile
  
router.put('/:id', jsonParser, jwtAuth, (req, res) => {
  
  // Set required fields, detect missing fields
  const requiredFields = ['name', 'email', 'userAccount', 'orgProfId'];
  const missingField = requiredFields.find(field => !(field in req.body));
  
  if(missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    });
  }
  
  // Detect non-string fields
  const stringFields = ['name', 'website', 'email', 'phone', 'summary',];
  const nonStringField = stringFields.find(field => 
    (field in req.body && typeof req.body[field] !== 'string'));
    
  // Reject request with non-string fields
  if (nonStringField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Empty string field',
      location: nonStringField
    });
  }
  
  const emptyStringField = requiredFields.find(field => 
  (field in req.body && req.body[field] === ''));
  
  // Required fields also may not be empty strings
  if (emptyStringField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Empty string in required field',
      location: emptyStringField
    });
  }
  
  // Ensure /:id and orgProfId match
  if (req.params.id != req.body.orgProfId) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Request parameter and body IDs do not match'
    });
  }
  
  // Ensure userAccount is valid
  User.findById(req.body.userAccount)
    .then(function(prof){})
    .catch(function(err) {
      return res.status(422).json({
        code: 422,
        reason: 'ValidationError',
        message: 'Invalid user account ID'
      });
    });

  // Ensure /:id is a valid IndProf
  OrgProf.findById(req.params.id)
    .then(function(prof) {
      return OrgProf.update({
        name: req.body.name,
        website: req.body.website,
        email: req.body.email,
        phone: req.body.phone,
        summary: req.body.summary,
        userAccount: req.body.userAccount
      })
    .then(function(prof) {
      return res.status(204).json(prof);
    })
    .catch(function(err) {
      return res.status(500).json({
        code: 500,
        reason: 'Internal server error'
      });
    });
  })
  .catch(function(err) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Invalid ID'
    });
  });
  
});

// GET /:id: Retrieve a specific organization profile

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