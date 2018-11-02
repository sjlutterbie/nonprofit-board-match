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

const apps = require('../../server/portal/components/applications');
const { User } = require('../../server/api/users');
const { IndProf } = require('../../server/api/indProf');
const {Application} = require('../../server/api/applications');
const {OrgProf} = require('../../server/api/orgProf');
const {Position} = require('../../server/api/positions');

describe('Component: applications', function() {
  
  describe('Controllers', function() {
    
    describe('getApplicationPromise()', function() {
      
      it('Should be a function', function() {
        expect(apps.getApplicationPromise).to.be.a('function');
      });
      it('Should return a promise', function() {
        const appId = faker.random.alphaNumeric(10);
        let testObj = apps.getApplicationPromise(appId);
        expect(testObj).to.be.a('promise');
        // Resolve/reject promise to avoid errors
        testObj.then(function(res){},function(err){});
      });
    });
  });
  
  describe('Views', function(){
    
    describe('staticMode()', function() {
      
      it('Should be a function', function() {
        expect(apps.staticMode).to.be.a('function');
      });
      
      it('Should return a string', function(){
        const testApp = {
          coverMessage: faker.random.alphaNumeric(10)
        };
        expect(apps.staticMode(testApp)).to.be.a('string');
      });
    });
    
    describe('createMode()', function() {
      
      it('Should be a function', function() {
        expect(apps.createMode).to.be.a('function');
      });
      
      it('Should return a string', function() {
        expect(apps.createMode()).to.be.a('string');
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
    
    const testIds = {};

    before(function() {
      return runServer(TEST_DATABASE_URL);
    });
    
    // Create a test application (requires linked objects)
    before(function() {
      return new Promise(function(resolve){
        User.create(
          {
            username: faker.random.alphaNumeric(10),
            password: faker.random.alphaNumeric(10)
          }
        ).then(function(user) {
          testIds.userId = user._id;
          return IndProf.create (
            {
              firstName: faker.name.firstName(),
              lastName: faker.name.lastName(),
              email: faker.internet.email(),
              userAccount: user._id
            }
          );
        }).then(function(indProf) {
          testIds.indProfId = indProf._id;
          return OrgProf.create(
            {
              name: faker.company.companyName(),
              email: faker.internet.email(),
              userAccount: testIds.userId
            }  
          );
        }).then(function(orgProf) {
          testIds.orgProfId = orgProf._id;
          return Position.create(
            {
              title: faker.name.jobTitle(),
              description: faker.lorem.paragraphs(2),
              dateCreated: new Date(),
              currentlyOpen: Math.random() > .5 ? true : false,
              orgProf: orgProf._id
            }
          );
        }).then(function(position) {
          testIds.posId = position._id;
          return Application.create(
            {
              coverMessage: faker.lorem.paragraphs(2),
              applicationDate: new Date(),
              position:testIds.posId,
              indProf: testIds.indProfId
            }
          );
        }).then(function(application) {
          testIds.appId = application._id;
          resolve();
        }).catch(function(err) {
          return err;
        });
      });
    });

    after(function() {
      let userProm = User.deleteMany({});
      let indProm = IndProf.deleteMany({});
      let orgProm = OrgProf.deleteMany({});
      let posProm = Position.deleteMany({});
      let appProm= Application.deleteMany({});
      
      Promise.all([userProm, indProm, orgProm, posProm, appProm])
        .then(function(res) {
          return closeServer();
        })
        .catch(function(err) {
          return err;
        });
    });

    after(function() {
      return closeServer();
    });
    
    describe('/apply', function() {
      
      const testUrl = '/portal/components/applications/apply';

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
      
      it('Should accept an authorized request', function() {
        return chai.request(app)
          .get(testUrl)
          .set('authorization', `Bearer ${token}`)
          .then(function(res) {
            expect(res).to.have.status(200);
            expect(res).to.be.an('object');
          });
      });
    });
    
    describe('GET /apply', function() {

      let testUrl = `/portal/components/applications/viewapp/foo`;

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
      
      it('Should accept an authorized request', function() {

        testUrl = `/portal/components/applications/viewapp/${testIds.appId}`;
        
        return chai.request(app)
          .get(testUrl)
          .set('authorization', `Bearer ${token}`)
          .then(function(res) {
            expect(res).to.have.status(200);
            expect(res).to.be.an('object');
          });
      });
    });
  });
});