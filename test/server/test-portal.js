'use strict';

// Load testing packages
const chai = require('chai');
const chaiHttp = require('chai-http');
  chai.use(chaiHttp);
const jwt = require('jsonwebtoken');

// Simplify expect functions
const expect = chai.expect;

// Load required modules
//const portal = require('../../server/portal');
const { app, runServer, closeServer } = require('../../index');
const { PORT, TEST_DATABASE_URL, JWT_SECRET } = require('../../config');

describe('/portal', function() {
  
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });
  
  after(function() {
    return closeServer();
  });
  
  describe('GET /portal', function() {
    const testUser = {
      username: 'testUser',
      password: 'testPassword'
    }

    it('Should reject users with no credentials', function() {
      return chai.request(app)
        .get('/portal')
        .then(function(res) {
          expect(res).to.have.status(401);
        });
    });
    
    it('Should reject user with an incorrect token', function() {
      const token = jwt.sign(
        {
          user: testUser.username
        },
        'wrongSecret',
        {
          algorithm: 'HS256',
          expiresIn: '7d'
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
    
    it('Should reject user with an expired token', function() {
      // Generate an expired token
      const token = jwt.sign(
        {
          user: testUser.username,
          exp: (Math.floor(Date.now()/1000) - 10) // Expired 10 seconds ago
        },
        JWT_SECRET,
        {
          algorithm: 'HS256',
          subject: testUser.username
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
      const token = jwt.sign(
        {
          user: testUser.username
        },
        JWT_SECRET,
        {
          algorithm: 'HS256',
          subject: testUser.username,
          expiresIn: '7d'
        }
      );
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
});