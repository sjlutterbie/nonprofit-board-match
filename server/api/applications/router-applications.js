'use strict';
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const router = express.Router();
const jsonParser = bodyParser.json();
const jwtAuth = passport.authenticate('jwt', {session: false});

const {Position} = require('../positions');
const {IndProf} = require('../indProf');
const {Application} = require('./models-applications');

  
// GET all Applications for an indProf

  // TODO


// GET all Applicaitons for a position

  // TODO: Non-MVP Feature

// PUT /:id update an application
  // Verify body & req.param match


  // TODO
    // Deleting an application must remove ref from:
      // Relevant indProf
      // Relevant position

router.delete('/:id', jsonParser, jwtAuth, (req, res) => {
  
  Application.findById(req.params.id)
    .then(
      // Success
      function(application) {
        Application.findByIdAndDelete(req.params.id)
        .then(
          // Success
          function(application) {
            res.status(202).json({id: application._id});
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
              // Application created
              return res.status(201).json(_app);
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