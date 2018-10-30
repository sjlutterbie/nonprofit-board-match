'use strict';

// Load testing packages
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
  chai.use(chaiHttp);
const faker = require('faker');
const mongoose = require('mongoose');
const sinon = require('sinon');

// Enable jQuery testing

const { JSDOM } = require('jsdom');
const window = new JSDOM(
  `<!DOCTYPE html><html><body></body></html>`).window;
global.$ = require('jquery')(window);

const lF = require('../client/public/js/login-form');

// Load testing server details
require('dotenv').config();
const { JWT_SECRET, PORT, TEST_DATABASE_URL } = require('../config');
const {app, runServer, closeServer } = require('../index');


// BEGIN TESTING
  
describe('Login Form User Interactions', function() {
  
  describe('[Create Account | Log in] link', function() {
  
    describe('toggleFormType function', function() {
      
      it('Should be a function', function() {
        expect(lF.toggleFormType).to.be.a('function');
      });
      
    });
    
    describe('toggleFormType: DOM manipulation', function() {

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
        expect($('.js-repeat-password').prop('required')).to.equal(true);
        expect($('.js-login-submit').val()).to.equal('Create Account');
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
        expect($('.js-login-submit').val()).to.equal('Log In');
        expect($('.js-create-account-link').text()).to.equal('Create Account');
        //Reset test DOM
        $('body').html('');
      });
    });
  });
});

describe('Login form submission', function() {
  
  // Initialize test server
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });
  
  // Create test user for login tests
  const testUser = {
    username: faker.random.alphaNumeric(10),
    password: faker.random.alphaNumeric(10)
  };
  
  // Test clean up
  
  // Close test server
  after(function() {
    return closeServer();
  });
  
  describe('chooseSubmitAction(e)', function() {
    it('Should be a function', function() {
      expect(lF.chooseSubmitAction).to.be.a('function');
    });
    it('Should return a string', function() {
      expect(lF.chooseSubmitAction()).to.be.a('string');
    });

    it('Should evaluate the DOM correctly', function() {
      
      // Create 'login form' test DOM
      $('body').html(`
        <div class="js-login-form"></div>
      `);
      // Run test
      expect(lF.chooseSubmitAction()).to.equal('logInUser');
      
      // Create 'create user' test DOM
      $('body').html(`
        <div class="js-login-form create-account"></div>
      `);
      // Run test
      expect(lF.chooseSubmitAction()).to.equal('createUser');
      // Reset test DOM
      $('body').html('');
    });
    
    
    
  });  
  
  
  
});

