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
    
 
  });
});