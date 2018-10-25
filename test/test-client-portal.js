'use strict';

// Load testing packages
const chai = require('chai');
const chaiHttp = require('chai-http');
  chai.use(chaiHttp);
const faker = require('faker');
const mongoose = require('mongoose');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');

// Simplify expect functions
const expect = chai.expect;

// Enable jQuery testing

const { JSDOM } = require('jsdom');
const window = new JSDOM(
  `<!DOCTYPE html><html><body></body></html>`).window;
global.$ = require('jquery')(window);

// Load module

const cP = require('../client/public/js/client-portal.js') // NOTE: Will need to update path after temp testing

// Load testing server details
require('dotenv').config();
const { JWT_SECRET, PORT, TEST_DATABASE_URL } = require('../config');
const {app, runServer, closeServer } = require('../index');
const { localStrategy, jwtStrategy } = require('../server/api/auth');

// Generate valid token
const token = jwt.sign(
  {
    user: faker.random.alphaNumeric(10),
  },
  JWT_SECRET,
  {
    algorithm: 'HS256',
    expiresIn: '1d'
  }
);

// Make token available in 'localStorage'

// TESTING

describe('Portal: Client-side user interaction', function() {
  
    
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  after(function() {
    return closeServer();
  });
  
  
  describe('Helper functionss', function() {

    describe('updateMain(content)', function() {
      
      it('Should be a function', function() {
        expect(cP.updateMain).to.be.a('function');
      });
      
      it('Should update the <main> element', function() {
        // Set up test DOM & content
        $('body').html('<main></main>');
        const testContent = 'foo';
        // Run the test
        cP.updateMain(testContent);
        expect($('main').html()).to.equal(testContent);
        // Reset test DOM
        $('body').html();
      });
    });
    
    describe('handleAjaxError()', function() {
      it('Should be a function', function() {
        expect(cP.handleAjaxError).to.be.a('function');
      });
    });
    
  });


  describe('tabNavMenu: loadIndProf', function() {
    it('Should be a function', function() {
      expect(cP.loadIndProf).to.be.a('function');
    });

    describe('Event handling', function() {
      
      // TODO
      
    });
    
  });
});