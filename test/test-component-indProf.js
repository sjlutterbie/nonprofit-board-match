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

describe('indProf.buildComponent()', function() {
  
  it('Should be a function', function() {
    expect(indProf.buildComponent).to.be.a('function');
  });
  it('Should return a string', function() {
    expect(indProf.buildComponent()).to.be.a('string');
  });

});