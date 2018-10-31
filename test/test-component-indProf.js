'use strict';

// Load testing packages
const chai = require('chai');
const faker = require('faker');
const mongoose = require('mongoose');
  mongoose.Promise = global.Promise;

// Simplify expect functions
const expect = chai.expect;

// Create DOM testing environment
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const window = new JSDOM(
  `<!DOCTYPE html><html><body></body></html>`).window;
global.$ = require('jquery')(window);
const { app, runServer, closeServer} = require('../index');
const { PORT, TEST_DATABASE_URL, JWT_SECRET } = require ('../config');
  
// Load modules
const iP = require('../server/portal/components/indprof');
const { IndProf } = require('../server/api/indProf');
const { User } = require('../server/api/users');


describe('Component: indprof', function() {
  
  describe('Controllers', function() {

    describe('getIndProfPromise', function() {
      
      it('Should be a function', function() {
        expect(iP.getIndProfPromise).to.be.a('function');
      });
      
      it('Should return a promise', function() {
        const profId = faker.random.alphaNumeric(10);
        let testObj = iP.getIndProfPromise(profId);
        expect(testObj).to.be.a('promise');
        // Resolve/reject promise to avoid errors
        testObj.then(function(res){},function(err){});
      });
      
      // The contents of this resolved promise is tested in the IndProf API
      
    });
  });
  
  describe('Views', function() {
    
    describe('editMode()', function() {
      
      it('Should be a function', function() {
        expect(iP.editMode).to.be.a('function');
      });
      
      it('Should return a string', function() {
        const userData = {
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          email: faker.internet.email(),
          phone: faker.phone.phoneNumber(),
          linkedIn: faker.internet.url()
        };
        expect(iP.editMode(userData)).to.be.a('string');
      });
    });
    
    describe('createMode()', function() {

      it('Should be a function', function() {
        expect(iP.createMode).to.be.a('function');
      });

      it('Should return a string', function() {
        const userData = {
          userId: faker.random.alphaNumeric(10)
        };
        expect(iP.createMode(userData)).to.be.a('string');
      });
    });
    
    describe('staticMode()', function() {
      
      it('Should be a function', function() {
        expect(iP.staticMode).to.be.a('function');
      });
      
      it('Should return a string', function() {
        const userData = {
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          email: faker.internet.email(),
          phone: faker.phone.phoneNumber(),
          linkedIn: faker.internet.url(),
          userAccount: faker.random.alphaNumeric(10),
          _id: faker.random.alphaNumeric(10)
        };
        expect(iP.staticMode(userData)).to.be.a('string');
      });
    });
  });



});

