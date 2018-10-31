'use strict';

// Load testing packages
const chai = require('chai');
const chaiHttp = require('chai-http');
  chai.use(chaiHttp);
  const expect = chai.expect;
const faker = require('faker');

// Load session variables
require('dotenv').config();
const { PORT, TEST_DATABASE_URL } = require('../../config');

// Load module
const { app, runServer, closeServer } = require('../../index');

// Test basic server functionality
describe('Server start/stop functions', function() {
  
  describe('runServer()', function() {
    
    it('Should be a function', function() {
      expect(runServer).to.be.a('function');
    });
    
    it('Should return a promise', function() {
      let testObj = runServer(TEST_DATABASE_URL+'X');
        // Note: +'X' above prevents server from actually starting, but
        //  function still returns (rejected) promise
      expect(testObj).to.be.a('promise');
      // Resolve/reject promise to avoid errors
      testObj.then(function(res){},function(err){});
    });
  });
  
  describe('closeServer()', function() {

    it('Should be a function', function() {
      expect(closeServer).to.be.a('function');
    });
    
    it('Should return a promise', function() {
      let testObj = closeServer();
      expect(testObj).to.be.a('promise');
      // Resolve/reject promise to avoid errors
      testObj.then(function(res){},function(err){});
    });
  });
});  


describe('Index-defined routes', function() {
  
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });
      
  after(function() {
    return closeServer();
  });

  describe('Test static route (/)', function() {
      
    it('Should return a 200 status code', function() {
      return chai.request(app)
        .get('/')
        .then(function(res) {
          expect(res).to.have.status(200);
        });
    });
  });
  
  describe('Test catchall route', function() {
    
    it('Should return a 404 status code', function() {
      const fakeRoute = '/' + faker.random.alphaNumeric(20);
      return chai.request(app)
        .get(fakeRoute)
        .then(function(res) {
          expect(res).to.have.status(404);
        });
    });
  });
});
