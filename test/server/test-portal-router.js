'use strict';

// Load testing packages
const chai = require('chai');
const chaiHttp = require('chai-http');
  chai.use(chaiHttp);
const jwt = require('jsonwebtoken');
const faker = require('faker');

// Simplify expect functions
const expect = chai.expect;

// Load required modules
const { app, runServer, closeServer } = require('../../index');
const { PORT, TEST_DATABASE_URL, JWT_SECRET } = require('../../config');

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

describe('Portal & Component Routes', function() {
  
  before(function() {
    return runServer(TEST_DATABASE_URL);
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
      // Run the test
      return chai.request(app)
        .get('/portal')
        .set('authorization', `Bearer ${token}`)
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          // TODO: Additional expectations based on structure of portal res
        });
    });
  });
  
  // COMPONENT: indProf
  
  describe('GET /portal/components/indprof/:id', function() {

    it('Should reject users with no credentials', function() {
      return chai.request(app)
        .get('/portal/components/indprof/:id')
        .then(function(res) {
          expect(res).to.have.status(401);
        });
    });
    
    it('Should reject user with an incorrect token', function() {
      // Run the test
      return chai.request(app)
        .get('/portal/components/indprof/:id')
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
        .get('/portal/components/indprof/:id')
        .set('authorization', `Bearer ${token}`)
        .then(function(res) {
          expect(res).to.have.status(401);
        });
    });
    
    it('Should permit authenticated users', function() {
      // Run the test
      return chai.request(app)
        .get('/portal/components/indprof/:id')
        .set('authorization', `Bearer ${token}`)
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          // TODO: Additional expectations based on structure of portal res
        });
    });
  });
  

  
  
  
  
  
});