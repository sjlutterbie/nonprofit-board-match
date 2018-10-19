'use strict';
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const {IndProf} = require('./models-indprofs');

const router = express.Router();

const jsonParser = bodyParser.json();

const jwtAuth = passport.authenticate('jwt', {session: false});


// What routes to include?
  // GET an individual profile
  
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
  
  return IndProf.create({
    firstName: firstName,
    lastName: lastName,
    email: email,
    phone: phone,
    linkedIn: linkedIn,
    userAccount: userAccount
  })
  .then(indProf => {
    return res.status(201).json(indProf);
  })
  .catch( err => {
    // Forward validation errors, hide unknown errors
    if (err.reason === 'ValidationError') {
      return res.status(err.code).json(err);
    }
    // Otherwise, return generic error to avoid leaking system details
    res.status(500).json(
      {code: 500,
      message: 'Internal server error'
    });
  });
});
  
  
  // PUT update an existing individual profile
  // DELETE an individual profile
  
module.exports = {
  router
};