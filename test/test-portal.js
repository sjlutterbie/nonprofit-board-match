'use strict';

// Load testing packages
const chai = require('chai');
const chaiHttp = require('chai-http');
  chai.use(chaiHttp);
const jwt = require('jsonwebtoken');

// Simplify expect functions
const expect = chai.expect;

// Load required modules
const portal = require('../server/portal/portal');                 // NOTE: Will need to add ../ to paths when moving from temp test directory
const { app, runServer, closeServer } = require('../index'); 
const { PORT, TEST_DATABASE_URL, JWT_SECRET } = require('../config');

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

describe('Portal: Controllers', function() {

  describe('portalBuildSelector()', function() {
    it('Should be a function', function() {
      expect(portal.portalBuildSelector).to.be.a('function');
    });
    it('Should return a string', function() {
      expect(portal.portalBuildSelector('indProf')).to.be.a('string');
    });
    it('Should select the correct build type', function() {
      const testCases = [
        ['indProf', undefined, 'indProf-Create'],
        ['indProf', 'profId', 'indProf-Static'],
        ['orgProf', undefined, 'orgProf-Create'],
        ['orgProf', 'profId', 'orgProf-Static']
      ];
      
      testCases.forEach(function(testCase){
        expect(portal.portalBuildSelector(
          testCase[0], testCase[1])).to.equal(testCase[2]);
      });
    });
  });
});