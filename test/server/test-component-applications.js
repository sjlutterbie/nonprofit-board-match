'use strict';

// Load testing packages
const chai = require('chai');
const chaiHttp = require('chai-http');
  const expect = chai.expect;
  chai.use(chaiHttp);
const faker = require('faker');
const mongoose = require('mongoose');
  mongoose.Promise = global.Promise;
const jwt = require('jsonwebtoken');

// Create DOM testing environment
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const window = new JSDOM(
  `<!DOCTYPE html><html><body></body></html>`).window;
global.$ = require('jquery')(window);
const { app, runServer, closeServer} = require('../../index');
const { PORT, TEST_DATABASE_URL, JWT_SECRET } = require ('../../config');
  
// Load modules

const apps = require('../../server/portal/components/applications');
const { User } = require('../../server/api/users');
const { IndProf } = require('../../server/api/indProf');

describe('Component: applications', function() {
  
  describe('Controllers', function() {
    
  
  });
  
  describe('Views', function(){
    
    describe('staticMode()', function() {
      
      it('Should be a function', function() {
        expect(apps.staticMode).to.be.a('function');
      });
      
      it('Should return a string', function(){
        const testApp = {
          coverMessage: faker.random.alphaNumeric(10)
        };
        expect(apps.staticMode(testApp)).to.be.a('string');
      });
    });
    
    describe('createMode()', function() {
      
      it('Should be a function', function() {
        expect(apps.createMode).to.be.a('function');
      });
      
      it('Should return a string', function() {
        expect(apps.createMode()).to.be.a('string');
      });
      
    });
 
  });

  describe('Routes', function() {
    
    // Create authToken
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
    
    before(function() {
      return runServer(TEST_DATABASE_URL);
    });
    
    after(function() {
      return closeServer();
    });
    
    describe('/apply', function() {
      
      const testUrl = '/portal/components/applications/apply';

      it('Should reject requests with no JWT', function() {
        return chai.request(app)
          .get(testUrl)
          .then(function(res) {
            expect(res).to.have.status(401);
          });
      });

      it('Should reject users with an incorrect JWT', function() {
        return chai.request(app)
          .get(testUrl)
          .set('authorization', `Bearer ${token}XX`)
          .then(function(res) {
            expect(res).to.have.status(401);
          }
        );
      });
      
      it('Should reject user with an expired token', function() {
        // Generate an expired token
        const token = jwt.sign(
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
        // Run the test
        return chai.request(app)
          .get(testUrl)
          .set('authorization', `Bearer ${token}`)
          .then(function(res) {
            expect(res).to.have.status(401);
          });
      });
      
      it('Should accept an authorized request', function() {
        return chai.request(app)
          .get(testUrl)
          .set('authorization', `Bearer ${token}`)
          .then(function(res) {
            expect(res).to.have.status(200);
            expect(res).to.be.an('object');
          });
      });
    });
  });
});