'use strict';

// Load testing packages
const chai = require('chai');
const chaiHttp = require('chai-http');
  chai.use(chaiHttp);
const faker = require('faker');
const mongoose = require('mongoose');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');


// Simplify expect functions
const expect = chai.expect;

// Enable jQuery testing

const { JSDOM } = require('jsdom');
const window = new JSDOM(
  `<!DOCTYPE html><html><body></body></html>`).window;
global.$ = require('jquery')(window);


// Load module

const cP = require('../client/public/js/client-portal.js') 

// Load testing server details
require('dotenv').config();
const { JWT_SECRET, PORT, TEST_DATABASE_URL } = require('../config');
const {app, runServer, closeServer } = require('../index');

// Generate valid token
const token = jwt.sign(
  {
    user: faker.random.alphaNumeric(10),
  },
  JWT_SECRET,
  {
    algorithm: 'HS256',
    expiresIn: '1d'
  }
);

// TESTING

describe('Portal: Client-side user interaction', function() {
  
  describe('Menu items', function() {
    
    describe('loadIndProf()', function() {
      
      it('Should be a function', function() {
        expect(cP.loadIndProf).to.be.a('function');
      });
      
      it('Should return a promise', function() {
        // Create test event
        const event = {
          currentTarget: {
            dataset: { 
              usertype: faker.random.alphaNumeric(10),
              profid: faker.random.alphaNumeric(10),
              mode: faker.random.alphaNumeric(10)
            }
          }
        };
        // Run test
        let testObj = cP.loadIndProf(event, token);
        expect(testObj).to.be.a('promise');
        // Resolve/reject promise to avoid errors
        testObj.then(function(res){},function(err){});
      });
    });
    
    describe('loadPositions()', function() {
      
      it('Should be a function', function() {
        expect(cP.loadPositions).to.be.a('function');
      });
      
      it('Should return a promise', function() {
        // Create test event
        const event = {
          currentTarget: {
            dataset: { 
              usertype: faker.random.alphaNumeric(10),
              profid: faker.random.alphaNumeric(10)
            }
          }
        };
        // Run test
        let testObj = cP.loadPositions(event, token);
        expect(testObj).to.be.a('promise');
        // Resolve/reject promise avoid errors
        testObj.then(function(res){},function(err){});
      });
    });
    
    describe('loadApplications()', function() {
      
      it('Should be a function', function() {
        expect(cP.loadApplications).to.be.a('function');
      });
      
      it('Should return a promise', function() {
        // Create test event
        const event = {
          currentTarget: {
            dataset: { 
              usertype: faker.random.alphaNumeric(10),
              profid: faker.random.alphaNumeric(10)
            }
          }
        };
        // Run test
        let testObj = cP.loadApplications(event, token);
        expect(testObj).to.be.a('promise');
        // Resolve/reject promise avoid errors
        testObj.then(function(res){},function(err){});
      });
    });
  });
  
  describe('Form actions', function() {
    
    describe('createIndProf()', function() {
      
      it('Should be a function', function() {
        expect(cP.createIndProf).to.be.a('function');
      });

      it('Should return a promise', function() {
        // Create test DOM
        $('body').html(`
          <form>
            <input name="firstname" value="${faker.name.firstName()}">
            <input name="lastName" value="${faker.name.lastName()}">
            <input name="email" value="${faker.internet.email()}">
            <input name="phone" value="${faker.phone.phoneNumber()}">
            <input name="linkedin" value="${faker.internet.url()}">
            <input name="userid" value="${faker.random.alphaNumeric(10)}">
          </form>
        `);
        // Run test
        let testObj = cP.createIndProf(token);
        expect(testObj).to.be.a('promise');
        // Resolve/reject promise to avoid errors
        testObj.then(function(res){},function(err){});
        // Reset test DOM
        $('body').html();
      });
    });
    
    describe('cancelIndProfEdit()', function() {
      
      it('Should be a function', function() {
        expect(cP.cancelIndProfEdit).to.be.a('function');
      });

      it('Should return a promise', function() {
        // Create test event
        const event = {
          currentTarget: {
            dataset: {
              userid: faker.random.alphaNumeric(10),
              profId: faker.random.alphaNumeric(10)
            }
          }
        };
        // Run test
        let testObj = cP.cancelIndProfEdit(event, token);
        expect(testObj).to.be.a('promise');
        // Resolve/reject promise to avoid errors
        testObj.then(function(res){},function(err){});
      });
    });
    
    describe('editIndProf()', function() {

      it('Should be a function', function() {
        expect(cP.editIndProf).to.be.a('function');
      })

      it('Should return a promise', function() {
        // Create test DOM
        $('body').html(`
          <form>
            <input name="firstname" value="${faker.name.firstName()}">
            <input name="lastName" value="${faker.name.lastName()}">
            <input name="email" value="${faker.internet.email()}">
            <input name="phone" value="${faker.phone.phoneNumber()}">
            <input name="linkedin" value="${faker.internet.url()}">
            <input name="userid" value="${faker.random.alphaNumeric(10)}">
            <input name="profid" value="${faker.random.alphaNumeric(10)}">
          </form>
        `);
        // Run test
        let testObj = cP.editIndProf(token);
        expect(testObj).to.be.a('promise');
        // Resolve/reject promise to avoid errors
        testObj.then(function(res){},function(err){});
        // Reset test DOM
        $('body').html();
      });
    });
  });
  
  describe('Non-Form Buttons', function() {
  
    describe('handleEditIndProfClick()', function() {

      it('Should be a function', function() {
        expect(cP.handleEditIndProfClick).to.be.a('function');
      });
      
      it('Should return a promise', function() {
        // Create test event
        const event = {
          currentTarget: {
            dataset: {
              userAccount: faker.random.alphaNumeric(10),
              profId: faker.random.alphaNumeric(10)
            }
          }
        };
        // Run test
        let testObj = cP.handleEditIndProfClick(event, token);
        expect(testObj).to.be.a('promise');
        // Resolve/reject promise to avoid errors
        testObj.then(function(res){},function(err){});
      });
    });





  });

















/*



  
  describe('Helper functionss', function() {

    describe('updateMain(content)', function() {
      
      it('Should be a function', function() {
        expect(cP.updateMain).to.be.a('function');
      });
      
      it('Should update the <main> element', function() {
        // Set up test DOM & content
        $('body').html('<main></main>');
        const testContent = 'foo';
        // Run the test
        cP.updateMain(testContent);
        expect($('main').html()).to.equal(testContent);
        // Reset test DOM
        $('body').html();
      });
    });
    
    describe('handleAjaxError()', function() {
      it('Should be a function', function() {
        expect(cP.handleError).to.be.a('function');
      });
    });
    
  });

  describe('Ajax calls', function() {
        
    before(function() {
      return runServer(TEST_DATABASE_URL);
    });
    
    after(function() {
      return closeServer();
    });
    
    describe('tabNavMenu: loadIndProf', function() {
      it('Should be a function', function() {
        expect(cP.loadIndProf).to.be.a('function');
      });
  
      describe('Event handling', function() {
        
        // Create test event
        const e = {
          preventDefault: sinon.spy(),
          currentTarget: {
            dataset: {
              userType: 'individual',
              profId: undefined
            }
          }
        };
      
        cP.loadIndProf(e, token,
          function(res) {
            expect(res).to.be.a('string');
          },
          function(err) {
            console.log(err);
          });

      });

    });
    
  });
*/  
  
  
});