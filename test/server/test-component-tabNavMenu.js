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
const tabNavMenu = require('../../server/portal/components/tabNavMenu');


// BEGIN TESTING

describe('tabNavMenu.buildMenu()', function() {
  
  it('Should be a function', function() {
    expect(tabNavMenu.buildMenu).to.be.a('function');
  });
  it('Should return a string', function() {
    expect(tabNavMenu.buildMenu()).to.be.a('string');
  });

});