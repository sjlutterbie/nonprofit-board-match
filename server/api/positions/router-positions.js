'use strict';
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const router = express.Router();
const jsonParser = bodyParser.json();
const jwtAuth = passport.authenticate('jwt', {session: false});


const {Position} = require('./models-positions');
const {OrgProf} = require('../orgProf/models-orgprofs');

// Get all Positions

  // TODO
  
// Get all Positions for a specific organization

  // TODO: Non-MVP Feature
  
// DELETE a position

  // TODO: Non-MVP Feature

// GET a single Position

router.get('/:id', jsonParser, jwtAuth, (req, res) => {
  
  Position.findById(req.params.id)
    .then(
      // Found profile
      function(position) {
        res.status(200).json(position);  
      },
      // Couldn't find position
      function(err) {
        return res.status(422).json({
          code: 422,
          reason: 'ValidationError',
          message: 'Invalid profile ID'
        });
      }
    );
});

// POST a new Position

  // TODO: Creating a new Position should update refs for
    // Relevant OrgProf

router.post('/', jsonParser, jwtAuth, (req, res) => {
  
  // Set required fields, detect missing fields
  const requiredFields = ['title', 'description', 'dateCreated', 'orgProf']; 

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
  
  // Set string fields, detect non-string data
  const stringFields = ['title', 'description']

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
  
  // Create new Position
  
  // Extract values from req.body
  let {title, description, dateCreated, orgProf} = req.body;
  
  title = title.trim();
  description = description.trim();
  
  // Validate OrgProf as OrgProf._id, then create user
    OrgProf.findById(orgProf)
      .then(
        // Resolve function
        function(org) {
          return Position.create(
            {
              title: title,
              description: description,
              dateCreated: dateCreated,
              orgProf: orgProf,
              applications: []
            })
            .then(
              // Resolve
              function(position) {
                return res.status(201).json(position);
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
            message: 'Invalid ID',
            location: orgProfs
          });
        }
      );

});

  
module.exports = {
  router
};