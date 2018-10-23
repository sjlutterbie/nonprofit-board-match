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

// GET: Retrieve all Positions (with query filters)

router.get('/', jsonParser, jwtAuth, (req, res) => {
  
  // Block requests with invalid query fields
  const allowedFields = ['currentlyOpen'];
  
  const invalidField = Object.keys(req.query).find(field =>
  !(allowedFields.includes(field)));
  
  if(invalidField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Invalid query field',
      location: invalidField
    });
  }
  
  // Run request
  Position.find(req.query)
    .exec(function(err, docs) {
      if(docs) {
        return res.status(200).json(docs);
      }
  
      if(err) {
        return res.status(500).json({
          code: 500,
          message: 'Internal server error'
        });
      }
    }
  );
  
});


// DELETE a position

router.delete('/:id', jsonParser, jwtAuth, (req, res) => {
  
  // Verify position exists
  Position.findById(req.params.id)
    .then(
      // Success: Delete position
      function(position) {
        Position.findByIdAndDelete(req.params.id)
        .then(
          // Success
          function(position) {
            return res.status(202).json({id: position._id});
          },
          // Failure
          function(err) {
            return res.status(500).json(
              {
                code: 500,
                message: 'Internal server error'
              }
            );
          }
        );
      },
      // Failure: Validation error (invalid id)
      function(err) {
        return res.status(422).json(
          {
            code: 422,
            reason: 'ValidationError',
            message: 'Invalid Application ID'
          }  
        );
      }
    );
  
});

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

router.post('/', jsonParser, jwtAuth, (req, res) => {
  
  // Set required fields, detect missing fields
  const requiredFields = ['title', 'description', 'dateCreated',
                          'currentlyOpen', 'orgProf']; 

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
  
  // Verify currentlyOpen is a boolean
  if (typeof req.body.currentlyOpen != 'boolean') {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Non-boolean for currentlyOpen'
    });
  }
  
  // Create new Position
  
  // Extract values from req.body
  let {title, description, dateCreated, currentlyOpen, orgProf} = req.body;
  
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
              currentlyOpen: currentlyOpen,
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