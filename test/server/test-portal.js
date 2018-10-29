'use strict';

// Load testing packages
const chai = require('chai');
const chaiHttp = require('chai-http');
  chai.use(chaiHttp);
const jwt = require('jsonwebtoken');

// Simplify expect functions
const expect = chai.expect;

// Load required modules
const portal = require('../../server/portal/portal'); 
const { app, runServer, closeServer } = require('../../index'); 
const { PORT, TEST_DATABASE_URL, JWT_SECRET } = require('../../config');

describe('Portal: View', function() {
  
  describe('portalView()', function() {
    it('Should be a function', function() {
      expect(portal.buildPortal).to.be.a('function');
    });
    it('Should return a string', function() {
      expect(portal.buildPortal()).to.be.a('string');
    });
  });
  
});