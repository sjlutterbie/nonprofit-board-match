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
const indProf = require('../server/portal/components/component-indProf');
const { IndProf } = require('../server/api/indProf');
const { User } = require('../server/api/users');

// BEGIN TESTING

describe('Component: indProf', function() {

  describe('indProf.buildComponent()', function() {
    
    it('Should be a function', function() {
      expect(indProf.buildComponent).to.be.a('function');
    });

    it('Should return a string', function() {
      expect(indProf.buildComponent()).to.be.a('string');
    });
  });

  describe('indProf.setView()', function() {

    it('Should be a function', function() {
      expect(indProf.setView).to.be.a('function');
    });

    it('Should return a string', function() {
      expect(indProf.setView()).to.be.a('string');
    });

    it('Should reject invalid modes', function() {
      expect(indProf.setView.bind(indProf, 'ABC', 'XXx'))
        .to.throw('Invalid view mode passed to indProf.setView()');
    });

    it('Should return the expect value in all cases', function(){
      // Build test cases
      const testCases = [
      // [profId, mode, expectedMode]
        // If profId is undefined, default to 'create'
      [undefined, undefined, 'create'],
      [undefined, 'edit', 'create'],
      [undefined, 'create', 'create'],
      [undefined, 'static', 'create'],
        // If profId is defined but mode isn't, default to 'static'
      ['ABC', undefined, 'static'],
        //If profId and mode are defined, return mode
      ['ABC', 'edit', 'edit'],
      ['ABC', 'create', 'create'],
      ['ABC', 'static', 'static']
      ];
      // Run tests
      testCases.forEach(function(testCase) {
        expect(indProf.setView(testCase[0], testCase[1]))
          .to.equal(testCase[2]);
      });
    });
  });
  
  describe('indProf.editMode()', function() {

    
    it('Should be a function', function() {
      expect(indProf.editMode).to.be.a('function');
    });
    
    it('Should return a string', function() {
      expect(indProf.editMode()).to.be.a('string');
    });
    

  });
  
  
});

