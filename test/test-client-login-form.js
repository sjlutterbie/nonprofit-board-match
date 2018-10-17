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
  
    // TODO: Test & build remaining functionality

  });

  describe('Helper functions', function() {
    
    describe('checkElementForClass()', function() {
      it('Should be a function', function() {
        expect(lF.checkElementForClass).to.be.a('function');
      });
      it('Should return a boolean', function() {
        $('body').html('<div class="a b"></div>');
        expect(lF.checkElementForClass("a","b")).to.be.a('boolean');
      });
      it('Should require two string paramaters', function() {
        const testCases = [
          ["a", "b", true],               // Success
          [1, "b", false],                // First element not string
          ["a", 1, false],                // Second element not string
          [1,2, false],                   // Neither element string
          [[], "b", false],               // Array as parameter
          ["a", {}, false],               // Object as parameter
          [function foo() {}, "b", false] // Function as paramter
        ];
        testCases.forEach(function(testCase) {
          if(testCase[2]) {
            expect(lF.checkElementForClass.bind(lF, testCase[0], testCase[1]))
            .to.not.throw('checkElementForClass: Parameter is not a string');
          } else {
            expect(lF.checkElementForClass.bind(lF, testCase[0], testCase[1]))
            .to.throw('checkElementForClass: Parameter is not a string');
          }
        });
      });
      
      it('Should check whether an HTML element has a given class', function() {
        // Set up test DOM
          // Multiple elementIdentifier (testClassX) for each case:
            // Has the target class
            // Has a different class
            // Has no second class
        $('body').html(
          `<div class="testClass1 targetClass"></div>
           <div class="testClass2 targetClass"></div>
           <div class="testClass3 incorrectClass1"></div>
           <div class="testClass4 incorrectClass1"></div>
           <div class="testClass5"></div>
           <div class="testClass6"></div>`
        );
        const testCases = [
          ['.testClass1', 'targetClass', true],
          ['.testClass2', 'targetClass', true],
          ['.testClass3', 'targetClass', false],
          ['.testClass4', 'targetClass', false],
          ['.testClass5', 'targetClass', false],
          ['.testClass6', 'targetClass', false],
        ];
        // Run tests
        testCases.forEach(function(testCase) {
          expect(lF.checkElementForClass(testCase[0], testCase[1], $))
          .to.equal(testCase[2]);
        });
        // Reset test DOM
        $('body').html('');
      });
      
    });
    
    
  });
  
  
});
