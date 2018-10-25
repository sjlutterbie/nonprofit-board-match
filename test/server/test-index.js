'use strict';

// Load testing packages
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

// Simplify expect functions
const expect = chai.expect;

// Load session variables
require('dotenv').config();
const { PORT, TEST_DATABASE_URL } = require('../config');

// Load module
const { app, runServer, closeServer } = require('../index');

// Test basic server functionality
describe('Server start/stop functions', function() {
  
  describe('runServer()', function() {
    it('Should be a function', function() {
      expect(runServer).to.be.a('function');
    }); 
  });
  
  describe('closeServer()', function() {
    it('Should be a function', function() {
      expect(closeServer).to.be.a('function');
    });
  });
});  

describe('Test static route (/)', function() {
    
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });
    
  after(function() {
    return closeServer();
  });
    
  it('Should return a 200 status code', function() {
    return chai.request(app)
      .get('/')
      .then(function(res) {
        expect(res).to.have.status(200);
      });
  });
});

// DEVELOPMENT ROUTE TESTING

describe('/authTest route', function() {
  
    before(function() {
      return runServer(TEST_DATABASE_URL);
    });
    
    after(function() {
      return closeServer();
    });
  
  it('Should return a 200 status code', function() {
    return chai.request(app)
      .get('/')
      .then(function(res){
        expect(res).to.have.status(200);
      });
  });
  
});