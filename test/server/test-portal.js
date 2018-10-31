'use strict';

// Load testing packages
const chai = require('chai');
const chaiHttp = require('chai-http');
  chai.use(chaiHttp);
  const expect = chai.expect;
const faker = require('faker');

// Load required modules
require('dotenv').config();
const {buildPortal} = require('../../server/portal/portal'); 
const { app, runServer, closeServer } = require('../../index'); 
const { PORT, TEST_DATABASE_URL, JWT_SECRET } = require('../../config');

describe('Portal: View', function() {
  
  describe('buildPortal()', function() {
    
    it('Should be a function', function() {
      expect(buildPortal).to.be.a('function');
    });

    it('Should return a string', function() {
      // Create test vars
      const userType = faker.random.alphaNumeric(10);
      const profId = faker.random.alphaNumeric(10);
      const userId = faker.random.alphaNumeric(10);
      const profile = faker.random.alphaNumeric(10);
      // Run test
      expect(buildPortal(userType, profId, userId, profile)).to.be.a('string');
    });
  });
  
});