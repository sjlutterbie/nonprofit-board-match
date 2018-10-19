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
const {OrgProf, orgProfSchema} = require('../../server/api/orgProf');
const {User} = require('../../server/api/users');

// DATA MODEL TESTING

describe('OrgProf API: Data Model', function() {
  
  it('Should be an object', function() {
    expect(orgProfSchema).to.be.an('object');
  });
  it('OrgProf should include the expected keys', function() {
    const requiredKeys = ['name', 'website', 'email', 'phone', 'summary',
      'userAccount', 'positions'];
    expect(orgProfSchema.obj).to.include.keys(requiredKeys);
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

describe('GET /api/orgprofs/:id', function() {
  
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

    afterEach(function() {
      return OrgProf.remove({});
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
      .get('/api/orgprofs/foo')
      .then(function(res) {
        expect(res).to.have.status(401);
      });
  });
  it('Should reject users with an incorrect JWT', function() {
    return chai.request(app)
      .get('/api/orgprofs/foo')
      .set('authorization', `Bearer ${token}XX`)
      .then(function(res) {
        expect(res).to.have.status(401);
      }
    );
  });
  it('Should reject users with an incorrect :id', function() {
    return chai.request(app)
      .get('/api/orgprofs/foo')
      .set('authorization', `Bearer ${token}`)
      .then(function(res) {
        expect(res).to.have.status(422);
      }
    );
  });
  
  it('Should return the correct orgProf', function(){
    // Create an indProf
    OrgProf.create(
      {
        name: faker.company.companyName(),
        website: faker.internet.url(),
        email: faker.internet.email(),
        phone: faker.phone.phoneNumber(),
        summary: faker.lorem.paragraphs(2),
        userAccount: testUser.userId
      }  
    ).then(
      // If successful, run API call
      function(orgProf) {
        const testURL = `/api/orgprofs/${orgProf._id}`;
        return chai.request(app)
          .get(testURL)
          .set('authorization', `Bearer ${token}`)
          .then(
            function(res) {
              expect(res).to.have.status(200);
              expect(res).to.be.a('object');
              expect(res[0]).to.deep.equal(orgProf[0]);
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




describe('POST /api/orgprofs', function() {
  
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

    afterEach(function() {
      return OrgProf.remove({});
    });
  
  // orgProfs require an associated userAccount
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
      .post('/api/orgprofs')
      .send({
        name: faker.company.companyName(),
        website: faker.internet.url(),
        email: faker.internet.email(),
        phone: faker.phone.phoneNumber(),
        summary: faker.lorem.paragraphs(2),
        userAccount: testUser.userId
      })
      .then(function(res) {
        expect(res).to.have.status(401);
      });
  });
  it('Should reject users with an incorrect JWT', function() {
    return chai.request(app)
      .post('/api/orgprofs')
      .set('authorization', `Bearer ${token}XX`)
      .send({
        name: faker.company.companyName(),
        website: faker.internet.url(),
        email: faker.internet.email(),
        phone: faker.phone.phoneNumber(),
        summary: faker.lorem.paragraphs(2),
        userAccount: testUser.userId
      })
      .then(function(res) {
        expect(res).to.have.status(401);
    });
  });
  it('Should reject submissions with a missing name', function() {
    return chai.request(app)
      .post('/api/orgprofs')
      .set('content-type', 'application/json')
      .send({
        website: faker.internet.url(),
        email: faker.internet.email(),
        phone: faker.phone.phoneNumber(),
        summary: faker.lorem.paragraphs(2),
        userAccount: testUser.userId
      })
      .set('authorization', `Bearer ${token}`)
      .then(function(res) {
        expect(res).to.have.status(422);
      });
  });
  it('Should reject submissions with a missing email', function() {
    return chai.request(app)
      .post('/api/orgprofs')
      .set('content-type', 'application/json')
      .send({
        name: faker.company.companyName(),
        website: faker.internet.url(),
        phone: faker.phone.phoneNumber(),
        summary: faker.lorem.paragraphs(2),
        userAccount: testUser.userId
      })
      .set('authorization', `Bearer ${token}`)
      .then(function(res) {
        expect(res).to.have.status(422);
      });
  });
  it('Should reject submissions with a missing userAccount', function() {
    return chai.request(app)
      .post('/api/orgprofs')
      .set('content-type', 'application/json')
      .send({
        name: faker.company.companyName(),
        website: faker.internet.url(),
        email: faker.internet.email(),
        phone: faker.phone.phoneNumber(),
        summary: faker.lorem.paragraphs(2),
      })
      .set('authorization', `Bearer ${token}`)
      .then(function(res) {
        expect(res).to.have.status(422);
      });
  });
  it('Should reject submissions with a non-string name', function() {
    return chai.request(app)
      .post('/api/orgprofs')
      .set('content-type', 'application/json')
      .send({
        name: 1234,
        website: faker.internet.url(),
        email: faker.internet.email(),
        phone: faker.phone.phoneNumber(),
        summary: faker.lorem.paragraphs(2),
        userAccount: testUser.userId
      })
      .set('authorization', `Bearer ${token}`)
      .then(function(res) {
        expect(res).to.have.status(422);
      });
  });
  it('Should reject submissions with a non-string website', function() {
    return chai.request(app)
      .post('/api/orgprofs')
      .set('content-type', 'application/json')
      .send({
        name: faker.company.companyName(),
        website: 1234,
        email: faker.internet.email(),
        phone: faker.phone.phoneNumber(),
        summary: faker.lorem.paragraphs(2),
        userAccount: testUser.userId
      })
      .set('authorization', `Bearer ${token}`)
      .then(function(res) {
        expect(res).to.have.status(422);
      });
  });
  it('Should reject submissions with a non-string email', function() {
    return chai.request(app)
      .post('/api/orgprofs')
      .set('content-type', 'application/json')
      .send({
        name: faker.company.companyName(),
        website: faker.internet.url(),
        email: 1234,
        phone: faker.phone.phoneNumber(),
        summary: faker.lorem.paragraphs(2),
        userAccount: testUser.userId
      })
      .set('authorization', `Bearer ${token}`)
      .then(function(res) {
        expect(res).to.have.status(422);
      });
  });
  it('Should reject submissions with a non-string name', function() {
    return chai.request(app)
      .post('/api/orgprofs')
      .set('content-type', 'application/json')
      .send({
        name: faker.company.companyName(),
        website: faker.internet.url(),
        email: faker.internet.email(),
        phone: 1234,
        summary: faker.lorem.paragraphs(2),
        userAccount: testUser.userId
      })
      .set('authorization', `Bearer ${token}`)
      .then(function(res) {
        expect(res).to.have.status(422);
      });
  });
  it('Should reject submissions with a non-string name', function() {
    return chai.request(app)
      .post('/api/orgprofs')
      .set('content-type', 'application/json')
      .send({
        name: faker.company.companyName(),
        website: faker.internet.url(),
        email: faker.internet.email(),
        phone: faker.phone.phoneNumber(),
        summary: 1234,
        userAccount: testUser.userId
      })
      .set('authorization', `Bearer ${token}`)
      .then(function(res) {
        expect(res).to.have.status(422);
      });
  });
  it('Should reject submissions with an invalid userAccount', function() {
    return chai.request(app)
      .post('/api/orgprofs')
      .set('content-type', 'application/json')
      .send({
        name: faker.company.companyName(),
        website: faker.internet.url(),
        email: faker.internet.email(),
        phone: faker.phone.phoneNumber(),
        summary: faker.lorem.paragraphs(2),
        userAccount: 'NotaUserId'
      })
      .set('authorization', `Bearer ${token}`)
      .then(function(res) {
        expect(res).to.have.status(422);
      });
  });
  it('Should create a new orgProf', function() {
    
    const testOrg = {
      name: faker.company.companyName(),
      website: faker.internet.url(),
      email: faker.internet.email(),
      phone: faker.phone.phoneNumber(),
      summary: faker.lorem.paragraphs(2),
      userAccount: testUser.userId
    };

    return chai.request(app)
      .post('/api/orgprofs')
      .set('content-type', 'application/json')
      .send({
        name: testOrg.name,
        website: testOrg.website,
        email: testOrg.email,
        phone: testOrg.phone,
        summary: testOrg.summary,
        userAccount: testOrg.userAccount
      })
      .set('authorization', `Bearer ${token}`)
      .then(function(res) {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        expect(res.body).to.include.keys(
          'name',
          'website',
          'email',
          'phone',
          'summary',
          'userAccount'
        );
        expect(res.body.name).to.equal(testOrg.name);
        expect(res.body.website).to.equal(testOrg.website);
        expect(res.body.email).to.equal(testOrg.email);
        expect(res.body.phone).to.equal(testOrg.phone);
        expect(res.body.summary).to.equal(testOrg.summary);
      });
  });

  it('Should trim the relevant fields', function() {
    
    const testOrg = {
      name: faker.company.companyName(),
      website: faker.internet.url(),
      email: faker.internet.email(),
      phone: faker.phone.phoneNumber(),
      summary: faker.lorem.paragraphs(2),
      userAccount: testUser.userId
    };

    return chai.request(app)
      .post('/api/orgprofs')
      .set('content-type', 'application/json')
      .send({
        name: `   ${testOrg.name} `,
        website: `  ${testOrg.website}   `,
        email: `    ${testOrg.email}   `,
        phone: ` ${testOrg.phone} `,
        summary: `${testOrg.summary}        `,
        userAccount: testOrg.userAccount
      })
      .set('authorization', `Bearer ${token}`)
      .then(function(res) {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        expect(res.body).to.include.keys(
          'name', 'website', 'email', 'phone', 'summary', 'userAccount');
        expect(res.body.name).to.equal(testOrg.name);
        expect(res.body.website).to.equal(testOrg.website);
        expect(res.body.email).to.equal(testOrg.email);
        expect(res.body.phone).to.equal(testOrg.phone);
        expect(res.body.summary).to.equal(testOrg.summary);
        return OrgProf.findById(res.body._id,
          function(err, org) {
            if(err) {
              return err;
            } else {
              expect(org).to.not.be.null,
              expect(org.name).to.equal(testOrg.name);
            }
          }
        );
    });
  });
});

