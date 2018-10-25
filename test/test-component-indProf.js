'use strict';

// Load testing packages
const chai = require('chai');

// Simplify expect functions
const expect = chai.expect;

// Create DOM testing environment
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const window = new JSDOM(
  `<!DOCTYPE html><html><body></body></html>`).window;
global.$ = require('jquery')(window);
  
// Load module
const indProf = require('../server/portal/components/component-indProf');


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
      expect(indProf.setView('ABC', 'XXx'))
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
  
  
});

