'use strict';
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const router = express.Router();
const jsonParser = bodyParser.json();
const jwtAuth = passport.authenticate('jwt', {session: false});
const mongoose = require('mongoose');

const {Position} = require('../positions');
const {IndProf} = require('../indProf');
const {Application} = require('./models-applications');

router.delete('/:id', jsonParser, jwtAuth, (req, res) => {
  
  Application.findById(req.params.id)
    .then(
      // Success
      function(application) {
        let posProm = Position.findByIdAndUpdate(
          application.position,
          {
            $pull: {applications: application._id}
          });
        let indProm = IndProf.findByIdAndUpdate(
          application.indProf,
          {
            $pull: {applications: application._id}
          });
        Promise.all([posProm, indProm])
        .then(
          Application.findByIdAndDelete(req.params.id)
        ).then(
          // Success
          function(application) {
            return res.status(202).json({id: application._id});
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
      // Failure
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

// GET all applications (with query filters)

router.get('/', jsonParser, jwtAuth, (req, res) => {

  // Block requests w/ no query string
  if (Object.keys(req.query).length === 0) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Query fields required'
    });
  }
  
  // Block requests with invalid query fields
  const allowedFields = ['indProf', 'position'];
  
  const invalidField = Object.keys(req.query).find(field => 
    !(allowedFields.includes(field))
  );

  if(invalidField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Invalid query field',
      location: invalidField
    });
  }

  // Run request
  Application.find(req.query)
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
  
// GET an individual Application

router.get('/:id', jsonParser, jwtAuth, (req, res) => {

  Application.findById(req.params.id)
    .then(
      // Found application
      function(application) {
        res.status(200).json(position);
      },
      // Couldn't find application
      function(err) {
        return res.status(422).json({
          code: 422,
          reason: 'ValidationError',
          message: 'Invalid Application ID'
        });
      }
    );
});

// POST a new Application

  // TODO: Creating a new application should update refs for:
    // Relevant indProf
    // Relevant position

router.post('/', jsonParser, jwtAuth, (req, res) => {
  
  // Set required fields, detect missing fields
  const requiredFields = ['coverMessage', 'applicationDate', 
                          'position', 'indProf'];

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
  const stringFields = ['coverMessage'];
  
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

  // Extract values from req.body
  let {coverMessage, applicationDate, position, indProf } = req.body;
  
  coverMessage = coverMessage.trim();

  // Verify 'position' is a valid ref id
  Position.findById(position)
  .then(
    function(_pos) {
      // Position verified
      IndProf.findById(indProf)
      .then(
        function(_prof) {
          // Profile verified
          Application.create(
            {
              coverMessage: coverMessage,
              applicationDate: applicationDate,
              position: position,
              indProf: indProf
            }  
          )
          .then(
            function(_app) {
              Position.findByIdAndUpdate(_app.position,
              {$push: {applications: _app._id}})
                .then(function(pos) {
                 return res.status(201).json(_app);                  
                });
            },
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
        function(err) {
          return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'Invalid `indProf` reference',
            location: indProf
          });
        }
      );
    },
    function(err) {
      return res.status(422).json({
        code: 422,
        reason: 'ValidationError',
        message: 'Invalid `position` reference',
        location: position
      });
    }
  );
});






module.exports = { router };