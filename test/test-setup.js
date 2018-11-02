'use strict';

// Set up the test environment, including loading required modules and
//  variables, and running the async functions required to initalize the 
//  server, and create test objects for use in various tests.

// Chai
global.chai = require('chai');
global.chaiHttp = require('chai-http');
  global.expect = chai.expect;
  chai.use(chaiHttp);

// Mongoose
global.mongoose = require('mongoose');
  mongoose.Promise = global.Promise;
  
// Authorization
global.jwt = require('jsonwebtoken');

// Environment & config variables
require('dotenv').config();
const { app, runServer, closeServer } = require('../index');
  global.app = app;

const { PORT, TEST_DATABASE_URL, JWT_SECRET } = require('../config');
  global.TEST_DATABASE_URL = TEST_DATABASE_URL;

// DOM testing
global.sinon = require('sinon');
global.jsdom = require('jsdom');
const { JSDOM } = jsdom;
global.window = new JSDOM(
  '<!DOCTYPE html><html><body></body></html>').window;
global.$ = require('jquery')(window);


// Testing tools
global.faker = require('faker');

// Data model objects
const { User } = require('../server/api/users');
const { IndProf } = require('../server/api/indProf');
const { OrgProf } = require('../server/api/orgProf');
const { Position } = require('../server/api/positions');
const { Application } = require('../server/api/applications');


// Server setup and data object creation
before(function() {

  // Testing constants 
  
  global.token = jwt.sign(
    {
      user: faker.random.alphaNumeric(10),
    },
    JWT_SECRET,
    {
      algorithm: 'HS256',
      expiresIn: '1d'
    }
  );
  
  global.expiredToken = jwt.sign(
    {
      user: faker.random.alphaNumeric(10),
      exp: (Math.floor(Date.now()/1000) - 10) // Expired 10 seconds ago
    },
    JWT_SECRET,
    {
      algorithm: 'HS256',
      subject: faker.random.alphaNumeric(10)
    }
  );

  global.testIds = {};
  
  global.testUser = {
    username: faker.random.alphaNumeric(10),
    password: faker.random.alphaNumeric(10)
  };
  
  global.testIndProf = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email()
  };
  
  global.testOrg = {
    name: faker.random.alphaNumeric(10),
    email: faker.internet.email()
  };
  
  global.testPos = {
    title: faker.random.alphaNumeric(10),
    description: faker.lorem.paragraphs(2),
    dateCreated: new Date(),
    currentlyOpen: Math.random() < .5 ? true : false
  };
  
  global.testApp = {
    coverMessage: faker.lorem.paragraphs(2),
    applicationDate: new Date()
  };

  return runServer(TEST_DATABASE_URL)
    .then(function(res) {
      return User.create(
        {
          username: testUser.username,
          password: testUser.password
        }
      );
    }).then(function(user){
      testIds.userId = user._id;
      return IndProf.create(
        {
          firstName: testIndProf.firstName,
          lastName: testIndProf.lastName,
          email: testIndProf.email,
          userAccount: testIds.userId
        }
      );
    }).then(function(profile) {
      testIds.indProfId = profile._id;
      return OrgProf.create(
        {
          name: testOrg.name,
          email: testOrg.email,
          userAccount: testIds.userId
        }  
      );
    }).then(function(profile) {
      testIds.orgProfId = profile._id;
      return Position.create(
        {
          title: testPos.title,
          description: testPos.description,
          dateCreated: testPos.dateCreated,
          currentlyOpen: testPos.currentlyOpen,
          orgProf: testIds.orgProfId
        }
      );
    }).then(function(pos){
      testIds.posId = pos._id;
      return Application.create(
        {
          coverMessage: testApp.coverMessage,
          applicationDate: testApp.applicationDate,
          position: testIds.posId,
          indProf: testIds.indProfId
        }  
      );
    }).then(function(application){
      testIds.appId = application._id;
      // Begin interlinking components
      return User.findByIdAndUpdate(
        testIds.userId,
        {
          indProf: testIds.indProfId
        }
      ).exec();
    }).then(function(res) {
      return IndProf.findByIdAndUpdate(
        testIds.indProfId, 
        {
          $push: { applications: testIds.appId }
        }
      ).exec();
    }).then(function(res) {
      return OrgProf.findByIdAndUpdate(
        testIds.orgProfId,
        {
          $push: { positions: testIds.posId }
        }
      ).exec();
    }).then(function(res) {
      return Position.findByIdAndUpdate(
        testIds.posId,
        {
          $push: {applications: testIds.appId }
        }
      ).exec();
    }).then(function(res) {
      console.log('Data objects created successfully');
      return;
    }).catch(function(error) {
      console.log(error);
      return error;
    });
});

// Data cleanup and server shutdown
after(function() {
  
  let userProm = User.deleteMany({}).exec();
  let indProfProm = IndProf.deleteMany({}).exec();
  let orgProfProm = OrgProf.deleteMany({}).exec();
  let posProm = Position.deleteMany({}).exec();
  let appProm = Application.deleteMany({}).exec();

  Promise.all([userProm, indProfProm, orgProfProm, posProm, appProm])
    .then(function(res){
      console.log('Test data successfully removed');
      return closeServer();
    });
});