'use strict';

// Load testing tools
const chai = require('chai');
const chaiHttp = require('chai-http');
  const expect = chai.expect;
  chai.use(chaiHttp);
const faker = require('faker');
const mongoose = require('mongoose');
  mongoose.Promise = global.Promise;
const jwt = require('jsonwebtoken');
const { app, runServer, closeServer} = require('../../index');
const { PORT, TEST_DATABASE_URL, JWT_SECRET } = require ('../../config');

// Load module
const iP = require('../../server/api/indProf');
const {User} = require('../../server/api/users');



// DATA MODEL TESTING

describe('IndProf API: Data Model', function() {
  
  it('Should be an object', function() {
    expect(iP.indProfSchema).to.be.an('object');
  });
  it('IndProf include the expected keys', function() {
    const requiredKeys = ['firstName', 'lastName', 'email', 'phone',
                          'linkedIn', 'userAccount'];
    expect(iP.indProfSchema.obj).to.include.keys(requiredKeys);
  });
});

// ROUTE TESTING

// Generate test data
const testUser = {
  username: faker.random.alphaNumeric(10),                   
  password: faker.random.alphaNumeric(10),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  email: faker.internet.email(),
  phone: faker.phone.phoneNumber(),
  linkedIn: faker.internet.url()
};

// Generate valid token
const token = jwt.sign(
  {
    user: testUser.username,
  },
  JWT_SECRET,
  {
    algorithm: 'HS256',
    expiresIn: '1d'
  }
);


describe('GET /api/indprofs/:id', function() {
  
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

    afterEach(function() {
      return iP.IndProf.remove({});
    });
  
  // indProfs require an associated userAccount
  before(function() {
    User.create(
      {
        username: testUser.username,
        password: testUser.password
      }).then(function(user) {
        testUser.userId = user._id;
      });
    
  });
  
  after(function() {
    User.deleteOne(
      {_id: testUser.userId},
      function(err, _) {
        if (err) {
          return err;
        }
      });
  });
      
  after(function() {
    return closeServer();
  });
  
  it('Should reject requests with no JWT', function() {
    return chai.request(app)
      .get('/api/indprofs/foo')
      .then(function(res) {
        expect(res).to.have.status(401);
      });
  });
  it('Should reject users with an incorrect JWT', function() {
    return chai.request(app)
      .get('/api/indprofs/foo')
      .set('authorization', `Bearer ${token}XX`)
      .then(function(res) {
        expect(res).to.have.status(401);
      }
    );
  });
  it('Should reject users with an incorrect :id', function() {
    return chai.request(app)
      .get('/api/indprofs/foo')
      .set('authorization', `Bearer ${token}`)
      .then(function(res) {
        expect(res).to.have.status(422);
      }
    );
  });
  
  it('Should return the correct indProf', function(){
    // Create an indProf
    iP.IndProf.create(
      {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        userAccount: testUser.userId
      }  
    ).then(
      // If successful, run API call
      function(indProf) {
        const testURL = `/api/indprofs/${indProf._id}`;
        return chai.request(app)
          .get(testURL)
          .set('authorization', `Bearer ${token}`)
          .then(
            function(res) {
              expect(res).to.have.status(200);
              expect(res.body).to.be.a('object');
              expect(res.body[0]).to.deep.equal(indProf[0]);
            },
            function(err) {
              return err;
            }
        );
      },
      // If failed, return error
      function(err) {
        return err;
      }
    );
    
  });

});

describe('POST /api/indprofs', function() {
  
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

    afterEach(function() {
      return iP.IndProf.remove({});
    });
  
  // indProfs require an associated userAccount
  before(function() {
    User.create(
      {
        username: testUser.username,
        password: testUser.password
      }).then(function(user) {
        testUser.userId = user._id;
      });
    
  });
  
  after(function() {
    User.deleteOne(
      {_id: testUser.userId},
      function(err, _) {
        if (err) {
          return err;
        }
      });
  });
      
  after(function() {
    return closeServer();
  });

  it('Should reject requests with no JWT', function() {
    return chai.request(app)
      .post('/api/indprofs')
      .send({
        firstName: testUser.firstName,
        lastName: testUser.lastName,
        email: testUser.email,
        phone: testUser.phone,
        linkedIn: testUser.linkedIn,
        userAccount: testUser.userId
      })
      .then(function(res) {
        expect(res).to.have.status(401);
      });
  });
  it('Should reject users with an incorrect JWT', function() {
    return chai.request(app)
      .post('/api/indprofs')
      .set('authorization', `Bearer ${token}XX`)
      .send({
        firstName: testUser.firstName,
        lastName: testUser.lastName,
        email: testUser.email,
        phone: testUser.phone,
        linkedIn: testUser.linkedIn,
        userAccount: testUser.userId
      })
      .then(function(res) {
        expect(res).to.have.status(401);
    });
  });
  it('Should reject submissions with a missing firstName', function() {
    return chai.request(app)
      .post('/api/indprofs')
      .set('content-type', 'application/json')
      .send({
        lastName: testUser.lastName,
        email: testUser.email,
        phone: testUser.phone,
        linkedIn: testUser.linkedIn,
        userAccount: testUser.userId
      })
      .set('authorization', `Bearer ${token}`)
      .then(function(res) {
        expect(res).to.have.status(422);
      });
  });
  it('Should reject submissions with a missing lastName', function() {
    return chai.request(app)
      .post('/api/indprofs')
      .set('content-type', 'application/json')
      .send({
        firstName: testUser.firstName,
        email: testUser.email,
        phone: testUser.phone,
        linkedIn: testUser.linkedIn,
        userAccount: testUser.userId
      })
      .set('authorization', `Bearer ${token}`)
      .then(function(res) {
        expect(res).to.have.status(422);
      });
  });
  it('Should reject submissions with a missing email', function() {
    return chai.request(app)
      .post('/api/indprofs')
      .set('content-type', 'application/json')
      .send({
        firstName: testUser.firstName,
        lastName: testUser.lastName,
        phone: testUser.phone,
        linkedIn: testUser.linkedIn,
        userAccount: testUser.userId
      })
      .set('authorization', `Bearer ${token}`)
      .then(function(res) {
        expect(res).to.have.status(422);
      });
  });
  it('Should reject submissions with a missing userAccount', function() {
    return chai.request(app)
      .post('/api/indprofs')
      .set('content-type', 'application/json')
      .send({
        firstName: testUser.firstName,
        lastName: testUser.lastName,
        email: testUser.email,
        phone: testUser.phone,
        linkedIn: testUser.linkedIn
      })
      .set('authorization', `Bearer ${token}`)
      .then(function(res) {
        expect(res).to.have.status(422);
      });
  });
  it('Should reject submissions with a non-string firstName', function() {
    return chai.request(app)
      .post('/api/indprofs')
      .set('content-type', 'application/json')
      .send({
        firstName: 1234,
        lastName: testUser.lastName,
        email: testUser.email,
        phone: testUser.phone,
        linkedIn: testUser.linkedIn,
        userAccount: testUser.userId
      })
      .set('authorization', `Bearer ${token}`)
      .then(function(res) {
        expect(res).to.have.status(422);
      });
  });
  it('Should reject submissions with a non-string lastName', function() {
    return chai.request(app)
      .post('/api/indprofs')
      .set('content-type', 'application/json')
      .send({
        firstName: testUser.firstName,
        lastName: 1234,
        email: testUser.email,
        phone: testUser.phone,
        linkedIn: testUser.linkedIn,
        userAccount: testUser.userId
      })
      .set('authorization', `Bearer ${token}`)
      .then(function(res) {
        expect(res).to.have.status(422);
      });
  });
  it('Should reject submissions with a non-string email', function() {
    return chai.request(app)
      .post('/api/indprofs')
      .set('content-type', 'application/json')
      .send({
        firstName: testUser.firstName,
        lastName: testUser.lastName,
        email: 1234,
        phone: testUser.phone,
        linkedIn: testUser.linkedIn,
        userAccount: testUser.userId
      })
      .set('authorization', `Bearer ${token}`)
      .then(function(res) {
        expect(res).to.have.status(422);
      });
  });
  it('Should reject submissions with a non-string phone', function() {
    return chai.request(app)
      .post('/api/indprofs')
      .set('content-type', 'application/json')
      .send({
        firstName: testUser.firstName,
        lastName: testUser.lastName,
        email: testUser.email,
        phone: 1234,
        linkedIn: testUser.linkedIn,
        userAccount: testUser.userId
      })
      .set('authorization', `Bearer ${token}`)
      .then(function(res) {
        expect(res).to.have.status(422);
      });
  });
  it('Should reject submissions with a non-string linkedIn', function() {
    return chai.request(app)
      .post('/api/indprofs')
      .set('content-type', 'application/json')
      .send({
        firstName: testUser.firstName,
        lastName: testUser.lastName,
        email: testUser.email,
        phone: testUser.phone,
        linkedIn: 1234,
        userAccount: testUser.userId
      })
      .set('authorization', `Bearer ${token}`)
      .then(function(res) {
        expect(res).to.have.status(422);
      });
  });
  it('Should reject submissions with an invalid userAccount', function() {
    return chai.request(app)
      .post('/api/indprofs')
      .set('content-type', 'application/json')
      .send({
        firstName: testUser.firstName,
        lastName: testUser.lastName,
        email: testUser.email,
        phone: testUser.phone,
        linkedIn: testUser.linkedIn,
        userAccount: 'NotaUserId'
      })
      .set('authorization', `Bearer ${token}`)
      .then(function(res) {
        expect(res).to.have.status(422);
      });
  });
  it('Should create a new indProf', function() {
    return chai.request(app)
      .post('/api/indprofs')
      .set('content-type', 'application/json')
      .send({
        firstName: testUser.firstName,
        lastName: testUser.lastName,
        email: testUser.email,
        phone: testUser.phone,
        linkedIn: testUser.linkedIn,
        userAccount: testUser.userId
      })
      .set('authorization', `Bearer ${token}`)
      .then(function(res) {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        expect(res.body).to.include.keys(
          'firstName',
          'lastName',
          'email',
          'phone',
          'linkedIn',
          'userAccount'
        );
        expect(res.body.firstName).to.equal(testUser.firstName);
        expect(res.body.lastName).to.equal(testUser.lastName);
        expect(res.body.email).to.equal(testUser.email);
        expect(res.body.phone).to.equal(testUser.phone);
        expect(res.body.linkedIn).to.equal(testUser.linkedIn);
      });
  });
  it('Should trim firstName and lastName', function() {
    return chai.request(app)
      .post('/api/indprofs')
      .set('content-type', 'application/json')
      .send({
        firstName: `    ${testUser.firstName}    `,
        lastName: `  ${testUser.lastName}  `,
        email: testUser.email,
        phone: testUser.phone,
        linkedIn: testUser.linkedIn,
        userAccount: testUser.userId
      })
      .set('authorization', `Bearer ${token}`)
      .then(function(res) {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        expect(res.body).to.include.keys(
          'firstName', 'lastName', 'email', 'phone', 'linkedIn',
          'userAccount');
        expect(res.body.firstName).to.equal(testUser.firstName);
        expect(res.body.lastName).to.equal(testUser.lastName);
        return iP.IndProf.findOne({
          email: testUser.email
        });
      })
      .then(function(user) {
        expect(user).to.not.be.null;
        expect(user.firstName).to.equal(testUser.firstName);
        expect(user.lastName).to.equal(testUser.lastName);
    });
  });
});

