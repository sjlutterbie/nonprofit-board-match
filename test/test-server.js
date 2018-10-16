'use strict';

// Load testing packages
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

// Simplify expect functions
const expect = chai.expect;

// Load module
const { app, runServer, closeServer } = require('../server');

// Test basic server functionality
describe('Server start/stop functions', function() {
  
  describe('runServer()', function() {
    it('Should be a function', function() {
      expect(runServer).to.be.a('function');
    }); 
    it('Should return a promise', function() {
      expect(runServer()).to.be.a('promise');
    });
  });
  
  describe('closeServer()', function() {
    it('Should be a function', function() {
      expect(closeServer).to.be.a('function');
    });
    it('Should return a promise', function() {
      expect(closeServer()).to.be.a('promise');
    });
  });
  
  describe('Test static route (/)', function() {
    
    before(function() {
      return runServer();
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
});