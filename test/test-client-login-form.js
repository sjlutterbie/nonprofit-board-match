'use strict';

// Load testing packages
const chai = require('chai');
const chaiHttp = require('chai-http');
  chai.use(chaiHttp);
const faker = require('faker');
const mongoose = require('mongoose');
const sinon = require('sinon');

// Simplify expect functions
const expect = chai.expect;

// Enable jQuery testing

const { JSDOM } = require('jsdom');
const window = new JSDOM(
  `<!DOCTYPE html><html><body></body></html>`).window;
global.$ = require('jquery')(window);

// Load the module //NOTE: let instead of const so it can be refreshed
const lF = require('../client/public/js/login-form');

// Load testing server details
require('dotenv').config();
const { JWT_SECRET, PORT, TEST_DATABASE_URL } = require('../config');
const {app, runServer, closeServer } = require('../server');
const { localStrategy, jwtStrategy } = require('../server/auth');

// Load Test user credentials
const testUser =  {
  username: 'testUser',
  password: 'testPassword'
};

// BEGIN TESTING
  
describe('Login Form User Interactions', function() {

  describe('[Create Account | Log in] link', function() {
  
    describe('toggleFormType function', function() {
      
      it('Should be a function', function() {
        expect(lF.toggleFormType).to.be.a('function');
      });
      
    });
    
    describe('DOM manipulation functionality', function() {

      it('Should transform the Login form to a Create Account form', function(){
        // Create test DOM
        $('body').html(`
           <div class="js-login-form"></div>
           <div class="js-login-form-heading">Log In</div>
           <input type="text" class="js-repeat-password"
                  name="password-repeat" style="display: none;"></input>
           <input type="submit" value="Log In" class="js-login-submit"></input>
           <a class="js-create-account-link">Create Account</a>
        `);  
        // Create the 'event' object;
        const e = {
          preventDefault: sinon.spy()
        };
        // Trigger the event
        lF.toggleFormType(e);
        // Evaluate results
        expect(e.preventDefault.called).to.equal(true);
        expect($('.js-login-form').hasClass('create-account')).to.equal(true);
        expect($('.js-login-form-heading').text()).to.equal('Create Account');
        expect($('.js-repeat-password').css('display')).to.equal('inline-block');
        expect($('input[name="password-repeat"]').prop('required')).to.equal(true);
        // Hack: Assign to constant because expect() returns .val() as ''
        let buttonVal = $('.js-login-submit').val();
        expect(buttonVal).to.equal('Create Account');
        expect($('.js-create-account-link').text()).to.equal('Log In');
        //Reset test DOM
        $('body').html('');
      });
      
      it('Should transform the Create Account form to a Log In form', function(){
        // Create test DOM
        $('body').html(`
           <div class="js-login-form create-account"></div>
           <div class="js-login-form-heading">Create Account</div>
           <input type="text" class="js-repeat-password"
                  name="password-repeat" style="display: block;" required></input>
           <input type="submit" value="Create Account" class="js-login-submit"></input>
           <a class="js-create-account-link">Log In</a>
        `);  
        // Create the 'event' object
        const e = {
          preventDefault: sinon.spy()
        };
        // Trigger the event
        lF.toggleFormType(e);
        // Evaluate results
        expect(e.preventDefault.called).to.equal(true);
        expect($('.js-login-form').hasClass('create-account')).to.equal(false);
        expect($('.js-login-form-heading').text()).to.equal('Log In');
        expect($('.js-repeat-password').css('display')).to.equal('none');
        expect($('.js-repeat-password').prop('required')).to.equal(false);
        // Hack: Assign to constant because expect() returns .val() as ''
        let buttonVal = $('.js-login-submit').val();
        expect(buttonVal).to.equal('Log In');
        expect($('.js-create-account-link').text()).to.equal('Create Account');
        //Reset test DOM
        $('body').html('');
      });
    });
  });
  

});

describe('Login User integration tests', function() {
  

  /*
  
  Log In User chain:
  ==================
  Start: logInUser
  ->  Success: loadPortal
      ->  Success: loadPortalSuccess
      ->  Error: loadPortalError
  ->  Error: loginError
  
  */

  // Initialize & close test server
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });
  
  after(function() {
    return closeServer();
  });

  /*
  
  Test cases
  ==========
  - Valid username & password -> Success
  - Invalid username (w/ valid password for testUser) -> Failure
  - Valid username w/ invalid password -> Failure
  
  */
  
  // Create test cases
  const testCases = [
    [testUser.username, testUser.password, true],
    [testUser.username+'X', testUser.password, false],
    [testUser.username, testUser.password+'X', false]
  ];

  // TODO: Build these tests in a way that supports their async nature.


});