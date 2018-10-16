'use strict';

// Load testing packages
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

// Simplify expect functions
const expect = chai.expect;

// Load module
const server = require('../server');


// Test basic server functionality
describe('Server start/stop functions', function() {
  
  describe('runServer()', function() {
    it('Should be a function', function() {
      expect(server.runServer).to.be.a('function');
    }); 
    it('Should return a promise', function() {
      expect(server.runServer()).to.be.a('promise');
    });
  });
  
  describe('closeServer()', function() {
    it('Should be a function', function() {
      expect(server.closeServer).to.be.a('function');
    });
    it('Should return a promise', function() {
      expect(server.closeServer()).to.be.a('promise');
    });
  });
});