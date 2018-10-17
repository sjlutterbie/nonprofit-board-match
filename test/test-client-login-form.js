'use strict';

// Load testing packages
const chai = require('chai');
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

// BEGIN TESTING
  
describe('Login Form JS', function() {

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
           <div class="js-repeat-password" style="display: none;"></div>
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
        expect($('.js-repeat-password').css('display')).to.equal('block');
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
           <div class="js-repeat-password" style="display: block;"></div>
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
        // Hack: Assign to constant because expect() returns .val() as ''
        let buttonVal = $('.js-login-submit').val();
        expect(buttonVal).to.equal('Log In');
        expect($('.js-create-account-link').text()).to.equal('Create Account');
        //Reset test DOM
        $('body').html('');
      });
    });
  });
  
  describe('Form submit button', function() {
    
    describe('chooseSubmitAction', function() {
      it('Should be a function', function() {
        expect(lF.chooseSubmitAction).to.be.a('function');
      });
      
      describe('On  createUser Form', function() {
        it('Should trigger createUser(e)', function() {
          
          // Set test variables
          $('body').html('<div class="js-login-form create-account"></div>');
          const e = {
            preventDefault: sinon.spy(),
            target: $('body')
          };
          // Run test
          expect(lF.chooseSubmitAction(e)).to.equal(lF.createUser(e));
          // Reset DOM
          $('body').html('');
        });
      });
      describe('On logInUser Form', function() {
        it('Should trigger logInUser()', function() {
          // Set test variables
          $('body').html('<div class="js-login-form"></div>');
          const e = {
            preventDefault: sinon.spy(),
            target: $('body')
          };
          // Run test
          expect(lF.chooseSubmitAction(e)).to.equal(lF.logInUser(e));
          // Reset DOM
          $('body').html('');
        });
      });
    });
    
    describe('logInUser', function() {
      it('Should be a function', function() {
        expect(lF.logInUser).to.be.a('function');
      });
      
      // TODO: Functionality
      
    });
    
    describe('createUser', function() {
      it('Should be a function', function() {
        expect(lF.createUser).to.be.a('function');
      });
      
      // TODO: Functionality
      
    });
  
  });

});