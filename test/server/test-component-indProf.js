'use strict';

// Load testing packages
const chai = require('chai');
const chaiHttp = require('chai-http');
  const expect = chai.expect;
  chai.use(chaiHttp);
const faker = require('faker');
const mongoose = require('mongoose');
  mongoose.Promise = global.Promise;
const jwt = require('jsonwebtoken');

// Create DOM testing environment
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const window = new JSDOM(
  `<!DOCTYPE html><html><body></body></html>`).window;
global.$ = require('jquery')(window);
const { app, runServer, closeServer} = require('../../index');
const { PORT, TEST_DATABASE_URL, JWT_SECRET } = require ('../../config');
  
// Load modules
const iP = require('../../server/portal/components/indprof');
const { IndProf } = require('../../server/api/indProf');
const { User } = require('../../server/api/users');


describe('Component: indprof', function() {
  
  describe('Controllers', function() {

    describe('getIndProfPromise', function() {
      
      it('Should be a function', function() {
        expect(iP.getIndProfPromise).to.be.a('function');
      });
      
      it('Should return a promise', function() {
        const profId = faker.random.alphaNumeric(10);
        let testObj = iP.getIndProfPromise(profId);
        expect(testObj).to.be.a('promise');
        // Resolve/reject promise to avoid errors
        testObj.then(function(res){},function(err){});
      });
      
      // The contents of this resolved promise is tested in the IndProf API
      
    });
  });
  
  describe('Views', function() {
    
    describe('editMode()', function() {
      
      it('Should be a function', function() {
        expect(iP.editMode).to.be.a('function');
      });
      
      it('Should return a string', function() {
        const userData = {
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          email: faker.internet.email(),
          phone: faker.phone.phoneNumber(),
          linkedIn: faker.internet.url()
        };
        expect(iP.editMode(userData)).to.be.a('string');
      });
    });
    
    describe('createMode()', function() {

      it('Should be a function', function() {
        expect(iP.createMode).to.be.a('function');
      });

      it('Should return a string', function() {
        const userData = {
          userId: faker.random.alphaNumeric(10)
        };
        expect(iP.createMode(userData)).to.be.a('string');
      });
    });
    
    describe('staticMode()', function() {
      
      it('Should be a function', function() {
        expect(iP.staticMode).to.be.a('function');
      });
      
      it('Should return a string', function() {
        const userData = {
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          email: faker.internet.email(),
          phone: faker.phone.phoneNumber(),
          linkedIn: faker.internet.url(),
          userAccount: faker.random.alphaNumeric(10),
          _id: faker.random.alphaNumeric(10)
        };
        expect(iP.staticMode(userData)).to.be.a('string');
      });
    });
  });
  
  describe('Routes', function() {
    
    // Create authToken
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
    
    before(function() {
      return runServer(TEST_DATABASE_URL);
    });
   
    // Create a valid userId and profId 
    const testIds = {};
    
   const testUser = {
      username: faker.random.alphaNumeric(10),
      password: faker.random.alphaNumeric(10)
    };
    
    const testProf = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email()
    };
      
    before(function() {
      return new Promise(function(resolve, reject) {
        User.create(testUser)
          .then(function(user) {
            testIds.userId = user._id;
            testProf.userAccount = user._id;
            return IndProf.create(testProf);
          }).then(function(prof) {
            testIds.profId = prof._id;
            resolve();
          }).catch(function(err) {
              return err;
          });
      });
    });
  
    // Clean up test environment
    after(function() {
      return new Promise(function(resolve) {
        User.deleteMany({})
          .then(function(res) {
            IndProf.deleteMany({});
          }).then(function(res){
            resolve();
          });
      })
        .catch(function(err) {
          return err;
        });
    });
    
    after(function() {
      return closeServer();
    });

    
    describe('GET /portal/components/indprof', function() {
      
      const testUrl = '/portal/components/indprof';

      it('Should reject requests with no JWT', function() {
        return chai.request(app)
          .get(testUrl)
          .then(function(res) {
            expect(res).to.have.status(401);
          });
      });

      it('Should reject users with an incorrect JWT', function() {
        return chai.request(app)
          .get(testUrl)
          .set('authorization', `Bearer ${token}XX`)
          .then(function(res) {
            expect(res).to.have.status(401);
          }
        );
      });
      
      it('Should reject user with an expired token', function() {
        // Generate an expired token
        const token = jwt.sign(
          {
            user: faker.random.alphaNumeric(10),
            exp: (Math.floor(Date.now()/1000) - 10) // Expired 10 seconds ago
          },
          JWT_SECRET,
          {
            algorithm: 'HS256',
            subject: faker.random.alphaNumeric(10)
          }
        );
        // Run the test
        return chai.request(app)
          .get(testUrl)
          .set('authorization', `Bearer ${token}`)
          .then(function(res) {
            expect(res).to.have.status(401);
          });
      });
      
      // It should reject a request without query values
      
      it('Should reject requests with missing query variables', function() {
        const testCases = [
          // No values
          '',
          // Missing mode
          `?indProf=${testIds.profId}&userId=${testIds.userId}`,
          // Missing userProf
          `?mode=static&indProf=${testIds.profId}`,
          // Missing indProf
          `?mode=edit&userId=${testIds.userId}`
        ];
        testCases.forEach(function(testCase) {
          const wrongUrl = testUrl + testCase;
          return chai.request(app)
            .get(wrongUrl)
            .set('authorization', `Bearer ${token}`)
            .then(function(res) {
              expect(res).to.have.status(422);
          });
        });
      });
      
      it('Should reject requests with invalid query values', function() {
        const testCases = [
          // Incorrect mode
          `?mode=XXX&userId=${testIds.userId}&profId=${testIds.profId}`,
          // Incorrect userId
          `?mode=static&userId=XXX&profId=${testIds.profId}`,
          // Incorrect profId
          `?mode=edit&userId=${testIds.userId}&profId=XXX`
        ];
        testCases.forEach(function(testCase) {
          const wrongUrl = testUrl + testCase;
          return chai.request(app)
            .get(wrongUrl)
            .set('authorization', `Bearer ${token}`)
            .then(function(res) {
              expect(res).to.have.status(422);
            });
        });
      });
      
      it('Should accept an authorized request for each mode', function() {
        const testCases = ['static', 'edit', 'create'];
        testCases.forEach(function(testCase) {
          const goodUrl = testUrl + 
            `?mode=${testCase}&userId=${testIds.userId}&profId=${testIds.profId}`;
          return chai.request(app)
            .get(goodUrl)
            .set('authorization', `Bearer ${token}`)
            .then(function(res) {
              expect(res).to.have.status(200);
              expect(res).to.be.an('object');
              expect(res.text).to.be.a('string');
            });
        });
      });
    });
  });
});