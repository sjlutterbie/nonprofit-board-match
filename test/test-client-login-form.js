'use strict';

// Load testing packages
const chai = require('chai');

// Simplify expect functions
const expect = chai.expect;

// Enable jQuery testing

const { JSDOM } = require('jsdom');
const window = new JSDOM(
  `<!DOCTYPE html><html><body></body></html>`).window;
global.$ = require('jquery')(window);

// Load the module
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
        // Trigger the event
        lF.toggleFormType();
        // Evaluate results
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
        // Trigger the event
        lF.toggleFormType();
        // Evaluate results
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
});
