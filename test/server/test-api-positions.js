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
const {Position, positionsSchema} = require('../../server/api/positions');
const {User} = require('../../server/api/users');
const {OrgProf} = require('../../server/api/orgProf');

// DATA MODEL TESTING

describe('Position API: Data Model', function() {
  
  it('Should be an object', function() {
    expect(positionsSchema).to.be.an('object');
  });
  it('OrgProf should include the expected keys', function() {
    const requiredKeys = ['title', 'description', 'dateCreated','orgProf',
    'applications'];
    expect(positionsSchema.obj).to.include.keys(requiredKeys);
  });
  
});

// Generate test Org
const testOrg = {
  name: faker.company.companyName(),
  email: faker.internet.email()
};

// Generate test User
const testUser = {
  username: faker.random.alphaNumeric(10),
  password: faker.random.alphaNumeric(10)
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

describe('GET /api/positions/:id', function() {

  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

    afterEach(function() {
      return Position.remove({});
    });
  
  // indProfs require an associated userAccount
  before(function() {
    User.create(
      {
        username: testUser.username,
        password: testUser.password
      }
    )
    .then(
      function(user) {
        testUser._id = user._id;
        OrgProf.create(
          {
            name: faker.company.companyName(),
            email: faker.internet.email(),
            userAccount: user._id
          }  
        )
        .then(
          function(org) {
            testOrg._id = org._id;
          },
          function(err) {return err}
        );
      },
      function(err) {return err}
    );
  });

  
  after(function() {
    User.deleteOne(
      {_id: testUser._id},
      function(err, _) {
        if (err) {
          return err;
        }
      });
    OrgProf.deleteOne(
      {_id: testOrg._id},
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
      .get('/api/positions/foo')
      .then(function(res) {
        expect(res).to.have.status(401);
      });
  });
  it('Should reject users with an incorrect JWT', function() {
    return chai.request(app)
      .get('/api/positions/foo')
      .set('authorization', `Bearer ${token}XX`)
      .then(function(res) {
        expect(res).to.have.status(401);
      }
    );
  });
  it('Should reject users with an incorrect :id', function() {
    return chai.request(app)
      .get('/api/positions/foo')
      .set('authorization', `Bearer ${token}`)
      .then(function(res) {
        expect(res).to.have.status(422);
      }
    );
  });
  
  it('Should return the correct Position', function(){
    // Create an indProf
    Position.create(
      {
        title: faker.name.jobTitle,
        description: faker.lorem.paragraphs(2),
        dateCreated: new Date(),
        orgProf: testOrg._id
      }  
    ).then(
      // If successful, run API call
      function(position) {
        const testURL = `/api/positions/${position._id}`;
        return chai.request(app)
          .get(testURL)
          .set('authorization', `Bearer ${token}`)
          .then(
            function(res) {
              expect(res).to.have.status(200);
              expect(res).to.be.a('object');
              expect(res[0]).to.deep.equal(position[0]);
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

describe('POST /api/positions', function() {
  
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

    afterEach(function() {
      return Position.remove({});
    });
  
  // indProfs require an associated userAccount
  before(function() {
    User.create(
      {
        username: testUser.username,
        password: testUser.password
      }
    )
    .then(
      function(user) {
        testUser._id = user._id;
        OrgProf.create(
          {
            name: faker.company.companyName(),
            email: faker.internet.email(),
            userAccount: user._id
          }  
        )
        .then(
          function(org) {
            testOrg._id = org._id;
          },
          function(err) {return err}
        );
      },
      function(err) {return err}
    );
  });

  
  after(function() {
    User.deleteOne(
      {_id: testUser._id},
      function(err, _) {
        if (err) {
          return err;
        }
      });
    OrgProf.deleteOne(
      {_id: testOrg._id},
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
      .post('/api/positions')
      .send({
        title: faker.name.jobTitle(),
        description: faker.lorem.paragraphs(2),
        dateCreated: new Date(),
        orgProf: testOrg._id
      })
      .then(function(res) {
        expect(res).to.have.status(401);
      });
  });
  it('Should reject users with an incorrect JWT', function() {
    return chai.request(app)
      .post('/api/positions')
      .set('authorization', `Bearer ${token}XX`)
      .send({
        title: faker.name.jobTitle(),
        description: faker.lorem.paragraphs(2),
        dateCreated: new Date(),
        orgProf: testOrg._id
      })
      .then(function(res) {
        expect(res).to.have.status(401);
    });
  });
  it('Should reject submissions with a missing title', function() {
    return chai.request(app)
      .post('/api/positions')
      .set('content-type', 'application/json')
      .send({
        description: faker.lorem.paragraphs(2),
        dateCreated: new Date(),
        orgProf: testOrg._id
      })
      .set('authorization', `Bearer ${token}`)
      .then(function(res) {
        expect(res).to.have.status(422);
      });
  });
  it('Should reject submissions with a missing description', function() {
    return chai.request(app)
      .post('/api/positions')
      .set('content-type', 'application/json')
      .send({
        title: faker.name.jobTitle(),
        dateCreated: new Date(),
        orgProf: testOrg._id
      })
      .set('authorization', `Bearer ${token}`)
      .then(function(res) {
        expect(res).to.have.status(422);
      });
  });
  it('Should reject submissions with a missing dateCreated', function() {
    return chai.request(app)
      .post('/api/positions')
      .set('content-type', 'application/json')
      .send({
        title: faker.name.jobTitle(),
        description: faker.lorem.paragraphs(2),
        orgProf: testOrg._id
      })
      .set('authorization', `Bearer ${token}`)
      .then(function(res) {
        expect(res).to.have.status(422);
      });
  });
  it('Should reject submissions with a missing orgProf', function() {
    return chai.request(app)
      .post('/api/positions')
      .set('content-type', 'application/json')
      .send({
        title: faker.name.jobTitle(),
        description: faker.lorem.paragraphs(2),
        dateCreated: new Date()
      })
      .set('authorization', `Bearer ${token}`)
      .then(function(res) {
        expect(res).to.have.status(422);
      });
  });
  it('Should reject submissions with a non-string title', function() {
    return chai.request(app)
      .post('/api/positions')
      .set('content-type', 'application/json')
      .send({
        title: 1234,
        description: faker.lorem.paragraphs(2),
        dateCreated: new Date(),
        orgProf: testOrg._id
      })
      .set('authorization', `Bearer ${token}`)
      .then(function(res) {
        expect(res).to.have.status(422);
      });
  });
  it('Should reject submissions with a non-string description', function() {
    return chai.request(app)
      .post('/api/positions')
      .set('content-type', 'application/json')
      .send({
        title: faker.name.jobTitle(),
        description: 1234,
        dateCreated: new Date(),
        orgProf: testOrg._id
      })
      .set('authorization', `Bearer ${token}`)
      .then(function(res) {
        expect(res).to.have.status(422);
      });
  });
   it('Should reject submissions with an invalid orgProf', function() {
    return chai.request(app)
      .post('/api/positions')
      .set('content-type', 'application/json')
      .send({
        title: faker.name.jobTitle(),
        description: 1234,
        dateCreated: new Date(),
        orgProf: 'NotAnOrgProf'
      })
      .set('authorization', `Bearer ${token}`)
      .then(function(res) {
        expect(res).to.have.status(422);
      });
  });
  
    it('Should create a new Position', function() {
    
    const testPosition = {
      title: faker.name.jobTitle(),
      description: faker.lorem.paragraphs(2),
      dateCreated: new Date(),
      orgProf: testOrg._id
    };
      
    return chai.request(app)
      .post('/api/positions')
      .set('content-type', 'application/json')
      .send({
        title: testPosition.title,
        description: testPosition.description,
        dateCreated: testPosition.dateCreated,
        orgProf: testPosition.orgProf
      })
      .set('authorization', `Bearer ${token}`)
      .then(function(res) {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        expect(res.body).to.include.keys(
          'title','description','dateCreated','orgProf','applications'
        );
        expect(res.body.title).to.equal(testPosition.title);
        expect(res.body.description).to.equal(testPosition.description);
      });
  });
  it('Should trim title and description', function() {
    
    const testPosition = {
      title: faker.name.jobTitle(),
      description: faker.lorem.paragraphs(2),
      dateCreated: new Date(),
      orgProf: testOrg._id
    };
    
    return chai.request(app)
      .post('/api/positions')
      .set('content-type', 'application/json')
      .send({
        title: `  ${testPosition.title} `,
        description: `   ${testPosition.description}  `,
        dateCreated: testPosition.dateCreated,
        orgProf: testPosition.orgProf
      })
      .set('authorization', `Bearer ${token}`)
      .then(function(res) {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        expect(res.body.title).to.equal(testPosition.title);
        expect(res.body.description).to.equal(testPosition.description);
        return Position.findOne({
          title: testPosition.title
        });
      })
      .then(function(position) {
        expect(position).to.not.be.null;
        expect(position.title).to.equal(testPosition.title);
        expect(position.description).to.equal(testPosition.description);
    });
  });
});


