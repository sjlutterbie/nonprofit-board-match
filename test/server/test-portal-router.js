'use strict';

// Load testing packages
const chai = require('chai');
const chaiHttp = require('chai-http');
  chai.use(chaiHttp);
  const expect = chai.expect;
const jwt = require('jsonwebtoken');
const faker = require('faker');

// Load env and config variables
require('dotenv').config();
const { PORT, TEST_DATABASE_URL, JWT_SECRET } = require('../../config');

// Load required modules
const { app, runServer, closeServer } = require('../../index');
const { User } = require('../../server/api/users');
const { IndProf } = require('../../server/api/indProf');

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


// PORTAL

describe('Portal route', function() {
  
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });
  
  // Set up test environment
  const testUser = {
    username: faker.random.alphaNumeric(10),
    password: faker.random.alphaNumeric(10)
  };
  
  const testProf = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email()
  };
    
  const testIds = {};
    
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


  describe('GET /portal', function() {

    it('Should reject users with no credentials', function() {
      return chai.request(app)
        .get('/portal')
        .then(function(res) {
          expect(res).to.have.status(401);
        });
    });
    
    it('Should reject user with an incorrect token', function() {
      // Run the test
      return chai.request(app)
        .get('/portal')
        .set('authorization', `Bearer ${token}XX`)
        .then(function(res) {
          expect(res).to.have.status(401);
        });
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
        .get('/portal')
        .set('authorization', `Bearer ${token}`)
        .then(function(res) {
          expect(res).to.have.status(401);
        });
    });
    
    it('Should permit authenticated users', function() {

      // Build query url
      const queryUrl =
        `/portal?userType=individual&profId=${testIds.profId}&userId=${testIds.userId}`;
      // Run the test
      return chai.request(app)
        .get(queryUrl)
        .set('authorization', `Bearer ${token}`)
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
        });
    });
  });
});