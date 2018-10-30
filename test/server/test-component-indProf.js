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
const { app, runServer, closeServer} = require('../../index');
const { PORT, TEST_DATABASE_URL, JWT_SECRET } = require ('../../config');
  
// Load modules
const indProf = require('../../server/portal/components/indprof');
const { IndProf } = require('../../server/api/indProf');
const { User } = require('../../server/api/users');

// BEGIN TESTING

describe('Component: indProf', function() {
  
  describe('indProf.editMode()', function() {
    it('Should be a function', function() {
      expect(indProf.editMode).to.be.a('function');
    });
    it('Should return a string', function() {
      const userData = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        phone: faker.phone.phoneNumber(),
        linkedIn: faker.internet.url()
      };
      expect(indProf.editMode(userData)).to.be.a('string');
    });
  });
  
  describe('indProf.createMode()', function() {
    it('Should be a function', function() {
      expect(indProf.createMode).to.be.a('function');
    });
    it('Should return a string', function() {
      const userData = {
        firstName: ' ',
        lastName: ' ',
        email: ' ',
        phone: ' ',
        linkedIn: ' '
      };
      expect(indProf.createMode(userData)).to.be.a('string');
    });
  });
  
  describe('indProf.staticMode', function() {
    it('Should be a function', function() {
      expect(indProf.staticMode).to.be.a('function');
    });
    it('Should return a string', function() {
      const userData = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        phone: faker.phone.phoneNumber(),
        linkedIn: faker.internet.url()
      };
      expect(indProf.staticMode(userData)).to.be.a('string');
    });
  });

});

