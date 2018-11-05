'use strict';
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
// const jwt = require('jsonwebtoken');
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

// GET all applications associated with an individual profile

router.get('/:id/apps', (req, res) => {
  
  const indProf = req.params.id;

  let promObj = IndProf.findById(indProf);
  
  promObj.exec()
    .then(function(prof) {
      res.status(200).send(prof);
    })
    .catch(function(err){
      // Couldn't find profile
      return res.status(422).json({
        code: 422,
        reason: 'ValidationError',
        message: 'Invalid profile ID',
        location: indProf
      });
    });
  
});

// PUT (update) an individual profile

router.put('/:id', jsonParser, jwtAuth, (req, res) => {
  
  // Set required fields, detect missing fields
  const requiredFields = ['firstName', 'lastName', 'email',
                          'userAccount', 'indProfId'];
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
  const stringFields = ['firstName', 'lastName', 'email', 'phone', 'linkedIn'];
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
  
  
  
  // Ensure /:id and indProfId match
  if (req.params.id != req.body.indProfId) {
    
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Request parameter and body IDs do not match'
    });
  }
  
  // Ensure /:id is a valid IndProf
  IndProf.findByIdAndUpdate(req.body.indProfId,
  {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phone: req.body.phone,
    linkedIn: req.body.linkedIn,
    userAccount: req.body.userAccount
  },
  {
    new: true
  })
  .then(function(indProf) {
    return res.status(200).json(indProf);
  })
  .catch(function(err) {
    return res.status(500).json({
      code: 500,
      reason: 'Internal server error'
    });
  });

});

// POST a new individual profile

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
  
  // Validate userAccount as User._id, then create profile
  User.findById(userAccount)
    .then(function(user) {
      return IndProf.create(
        {
          firstName: firstName,
          lastName: lastName,
          email: email,
          phone: phone,
          linkedIn: linkedIn,
          userAccount: userAccount
        }
      );
    })
    .then(function(indProf) {
      User.findByIdAndUpdate(indProf.userAccount,
        { indProf: indProf._id}
      ).then(function(user) {
        return res.status(201).json(indProf);
      });
    })
    .catch(function(err) {
      return res.status(500).json({
        code: 500,
        message: 'Internal server error'
      }
    );
  });

});




  
module.exports = {
  router
};