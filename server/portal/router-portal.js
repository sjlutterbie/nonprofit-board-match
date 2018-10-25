'use strict';

// This file contains the API routes for the Portal, and its various components.
//  Each API route calls the component's buildView() function, which returns a
//  string of HTML content. When called from the server-side, this HTML can be
//  inserted via template string. When called from the client-side, the HTML
//  will be the response body, which can then be inserted into the DOM via
//  client-side jQuery.


const express = require('express');
  const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../../config');
const { jwtStrategy } = require('../api/auth');
  passport.use(jwtStrategy);
const jwtAuth = passport.authenticate('jwt', {session: false});
const bodyParser = require('body-parser');
  const jsonParser = bodyParser.json();

// Load View
const portal = require('./portal');
const indProf = require('./components/component-indProf');
const positions = require('./components/component-positions');
const applications = require('./components/component-applications')

// Get request to load portal
router.get('/', jwtAuth, (req, res) => {

  // Extract arguments for portalBuilder
  const profType = req.query.profType;
  const profId = req.query.profId;
  const userId = req.user.userId;
  
  // Select which Portal View to build
  
  const viewType = portal.portalBuildSelector(profType, profId);

  // NOTE: Function Arguments used for dev purposes
  return res.send(portal.buildPortal(profType, profId, userId, viewType));

  
});

// Get request to load an indProf

router.get('/components/indprof/:id',jsonParser, jwtAuth, (req, res) => {
   
  console.log('Router call id: ' + req.params.id);
   
  return res.send(indProf.buildComponent());
  
});

// GET request to load positions view

router.get('/components/positions', jsonParser, jwtAuth, (req, res) => {
  
  return res.send(positions.buildComponent());
  
});


// GET request to load applications view

router.get('/components/applications', jsonParser, jwtAuth, (req, res) => {
  
  return res.send(applications.buildComponent());
  
});


///////////////////////////////////////////////////////////////////////////////

module.exports = {
  router
};