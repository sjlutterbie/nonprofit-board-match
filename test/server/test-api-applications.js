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
const {Application, applicationsSchema} = require('../../server/api/applications');
const {User} = require('../../server/api/users');
const {IndProf} = require('../../server/api/indProf');
const {OrgProf} = require('../../server/api/orgProf');
const {Position} = require('../../server/api/positions');


// DATA MODEL TESTING

describe('Applications API: Data Model', function() {
  
  it('Should be an object', function() {
    expect(applicationsSchema).to.be.an('object');
  });
  it('Application should include the expected keys', function() {
    const requiredKeys = ['coverMessage', 'applicationDate', 'position',
      'indProf'];
    expect(applicationsSchema.obj).to.include.keys(requiredKeys);
  });
  
});

// Create test _id storage

const testIds = {
  userId: '',
  indProfId: '',
  orgProfId: '',
  posId: ''
};

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


// POST ROUTE

describe('POST /api/application', function() {
  
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  afterEach(function() {
    return Application.remove({});
  });
  
  // applications require a userAccount -> indProf && -> orgProf -> position
  
  before(function() {
    // Generate test User
    User.create(
      {
        username: faker.random.alphaNumeric(10),
        password: faker.random.alphaNumeric(10)
      }
    ).then(
      // Store variables, advance
      function(user){
        testIds.userId = user._id;
        return user;
      },
      // Reject
      function(err) {
        return (err);
      }
    )
    .then(
      // Generate indProf
      function(user) {
        IndProf.create(
          {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            userAccount: user._id
          }
        ).then(
          // Store variables, advance
          function (indProf) {
            testIds.indProfId = indProf._id;
            return indProf;
          },
          function(err) {
            return err;
          }
        ).then(
          // Create orgProf
          function(indProf) { // Parameter included to clarify promise chain
            OrgProf.create(
              {
                name: faker.company.companyName(),
                email: faker.internet.email(),
                userAccount: testIds.userId
              }  
            ).then(
              function(orgProf) {
                testIds.orgProfId = orgProf._id;
                return orgProf;
              },
              function(err) {
                return err;
              }
            ).then(
              function(orgProf) { // Parameter included to clarify promise chain
                Position.create(
                  {
                    title: faker.name.jobTitle(),
                    description: faker.lorem.paragraphs(2),
                    dateCreated: new Date(),
                    orgProf: orgProf._id
                  }  
                ).then(
                  function(position) {
                    testIds.posId = position._id;
                    return position;
                  },
                  function(err) {
                    return err;
                  }
                );
              },
              function(err) {
                return err;
              }
            );
          },
          function (err) {
            return err;
          }
        );
      }, 
      function(err) {
        return err;
      }
    );
  });
  
  after(function() {
    // Clean up test objects
    User.findByIdAndDelete(testIds.userId)
      .then(
        function(_){
          // Success
        },
        function(err) {
          return err;
        }
      );
    IndProf.findByIdAndDelete(testIds.indProfId)
      .then(
        function(_){
          // Success
        },
        function(err) {
          return err;
        }
      );
    OrgProf.findByIdAndDelete(testIds.orgProfId)
      .then(
        function(_){
          // Success
        },
        function(err) {
          return err;
        }
      );
    Position.findByIdAndDelete(testIds.posId)
      .then(
        function(_){
          // Success
        },
        function(err) {
          return err;
        }
      );
  });
  
  after(function() {
    return closeServer();
  });
  
  // Finally,we test!
  
  it('Should reject requests with no JWT', function() {
    return chai.request(app)
      .post('/api/applications')
      .send({
        coverMessage: faker.lorem.paragraphs(2),
        applicationDate: new Date(),
        position: testIds.posId,
        indProf: testIds.indProfId
      })
      .then(function(res) {
        expect(res).to.have.status(401);
      });
  });
  it('Should reject requests with an incorrect JWT', function() {
    return chai.request(app)
      .post('/api/applications')
      .set('authorization', `Bearer ${token}XX`)
      .send({
        coverMessage: faker.lorem.paragraphs(2),
        applicationDate: new Date(),
        position: testIds.posId,
        indProf: testIds.indProfId
      })
      .then(function(res) {
        expect(res).to.have.status(401);
      });
  });
  
  it('Should reject requests with a  missing coverMessage', function() {
    return chai.request(app)
      .post('/api/applications')
      .set('authorization', `Bearer ${token}`)
      .send({
        applicationDate: new Date(),
        position: testIds.posId,
        indProf: testIds.indProfId
      })
      .then(function(res) {
        expect(res).to.have.status(422);
      });
  });
  it('Should reject requests with a  missing applicationDate', function() {
    return chai.request(app)
      .post('/api/applications')
      .set('authorization', `Bearer ${token}`)
      .send({
        coverMessage: faker.lorem.paragraphs(2),
        position: testIds.posId,
        indProf: testIds.indProfId
      })
      .then(function(res) {
        expect(res).to.have.status(422);
      });
  });
  it('Should reject requests with a  missing position', function() {
    return chai.request(app)
      .post('/api/applications')
      .set('authorization', `Bearer ${token}`)
      .send({
        coverMessage: faker.lorem.paragraphs(2),
        applicationDate: new Date(),
        indProf: testIds.indProfId
      })
      .then(function(res) {
        expect(res).to.have.status(422);
      });
  });
  it('Should reject requests with a  missing indProf', function() {
    return chai.request(app)
      .post('/api/applications')
      .set('authorization', `Bearer ${token}`)
      .send({
        coverMessage: faker.lorem.paragraphs(2),
        applicationDate: new Date(),
        position: testIds.posId
      })
      .then(function(res) {
        expect(res).to.have.status(422);
      });
  });
  
  it('Should reject requests with a non-string coverMessage', function() {
    return chai.request(app)
      .post('/api/applications')
      .set('authorization', `Bearer ${token}`)
      .send({
        coverMessage: 1234,
        applicationDate: new Date(),
        indProf: testIds.indProfId,
        position: testIds.posId
      })
      .then(function(res) {
        expect(res).to.have.status(422);
      });
  });
  
  it('Should reject requests with an invalid indProf', function() {
    return chai.request(app)
      .post('/api/applications')
      .set('authorization', `Bearer ${token}`)
      .send({
        coverMessage: faker.lorem.paragraph(2),
        applicationDate: new Date(),
        indProf: 'DefinitelyNotAnIndProf',
        position: testIds.posId
      })
      .then(function(res) {
        expect(res).to.have.status(422);
      });
  });
  it('Should reject requests with an invalid position', function() {
    return chai.request(app)
      .post('/api/applications')
      .set('authorization', `Bearer ${token}`)
      .send({
        coverMessage: faker.lorem.paragraphs(2),
        applicationDate: new Date(),
        indProf: testIds.indProfId,
        position: 'NotAPosId'
      })
      .then(function(res) {
        expect(res).to.have.status(422);
      });
  });
  
  it('Should create a new Application', function() {

    const testApp = {
      coverMessage: faker.lorem.paragraphs(2),
      applicationDate: new Date(),
      indProf: testIds.indProfId,
      position: testIds.posId
    };
    
    return chai.request(app)
      .post('/api/applications')
      .set('authorization', `Bearer ${token}`)
      .send({
        coverMessage: testApp.coverMessage,
        applicationDate: testApp.applicationDate,
        indProf: testApp.indProf,
        position: testApp.position
      })
      .then(function(res) {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        expect(res.body).to.include.keys(
          'coverMessage', 'applicationDate', 'indProf', 'position'
        );
        expect(res.body.coverMessage).to.equal(testApp.coverMessage);
    });
  });
  it('Should trim the coverMessage', function() {
    
    const testApp = {
      coverMessage: faker.lorem.paragraphs(2),
      applicationDate: new Date(),
      indProf: testIds.indProfId,
      position: testIds.posId
    };
    
    return chai.request(app)
      .post('/api/applications')
      .set('authorization', `Bearer ${token}`)
      .send({
        coverMessage: `  ${testApp.coverMessage}  `,
        applicationDate: testApp.applicationDate,
        indProf: testApp.indProf,
        position: testApp.position
      })
      .then(function(res) {
        expect(res.body.coverMessage).to.equal(testApp.coverMessage);
    });
  });

});
