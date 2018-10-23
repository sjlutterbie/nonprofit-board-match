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

describe('/api/positions routes', function() {

  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

    afterEach(function() {
      return Position.remove({});
    });
  
  // Positions require an associated userAccount and orgProf
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
  
    describe('GET /api/positions?queryString...', function() {
    it('Should reject requests with no JWT', function() {
      return chai.request(app)
        .get('/api/positions?foo=bar')
        .then(function(res) {
          expect(res).to.have.status(401);
        });
    });
    it('Should reject requests with an incorrect JWT', function() {
      return chai.request(app)
        .get('/api/positions?foo=bar')
        .set('authorization', `Bearer ${token}XX`)
        .then(function(res) {
          expect(res).to.have.status(401);
        });
    });



  });  

  describe('GET /api/positions/:id', function() {
    
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
          currentlyOpen: Math.random() > .5 ? true : false,
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
  
    it('Should reject requests with no JWT', function() {
      return chai.request(app)
        .post('/api/positions')
        .send({
          title: faker.name.jobTitle(),
          description: faker.lorem.paragraphs(2),
          dateCreated: new Date(),
          currentlyOpen: Math.random() > .5 ? true : false,
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
          currentlyOpen: Math.random() > .5 ? true : false,
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
          currentlyOpen: Math.random() > .5 ? true : false,
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
          currentlyOpen: Math.random() > .5 ? true : false,
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
          currentlyOpen: Math.random() > .5 ? true : false,
          orgProf: testOrg._id
        })
        .set('authorization', `Bearer ${token}`)
        .then(function(res) {
          expect(res).to.have.status(422);
        });
    });
    it('Should reject submissions with a missing currentlyOpen', function() {
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
          currentlyOpen: Math.random() > .5 ? true : false,
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
          currentlyOpen: Math.random() > .5 ? true : false,
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
          currentlyOpen: Math.random() > .5 ? true : false,
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
          currentlyOpen: Math.random() > .5 ? true : false,
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
        currentlyOpen: Math.random() > .5 ? true : false,
        orgProf: testOrg._id
      };
      return chai.request(app)
        .post('/api/positions')
        .set('content-type', 'application/json')
        .send({
          title: testPosition.title,
          description: testPosition.description,
          dateCreated: testPosition.dateCreated,
          currentlyOpen: Math.random() > .5 ? true : false,
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
        currentlyOpen: Math.random() > .5 ? true : false,
        orgProf: testOrg._id
      };
      return chai.request(app)
        .post('/api/positions')
        .set('content-type', 'application/json')
        .send({
          title: `  ${testPosition.title} `,
          description: `   ${testPosition.description}  `,
          dateCreated: testPosition.dateCreated,
          currentlyOpen: testPosition.currentlyOpen,
          orgProf: testPosition.orgProf
        })
        .set('authorization', `Bearer ${token}`)
        .then(function(res) {
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('object');
          expect(res.body.title).to.equal(testPosition.title);
          expect(res.body.description).to.equal(testPosition.description);
          expect(res.body.currentlyOpen).to.equal(testPosition.currentlyOpen);
          return Position.findOne({
            title: testPosition.title
          });
        })
        .then(function(position) {
          expect(position).to.not.be.null;
          expect(position.title).to.equal(testPosition.title);
          expect(position.description).to.equal(testPosition.description);
          expect(position.currentlyOpen).to.equal(testPosition.currentlyOpen);
      });
    });
  });
  
  describe('DELETE /api/positions/:id', function() {
  
    it('Should reject requests with no JWT', function() {
      return chai.request(app)
        .delete('/api/positions/foo')
        .then(function(res) {
          expect(res).to.have.status(401);
        });
    });
    it('Should reject requests with an incorrect JWT', function() {
      return chai.request(app)
        .delete('/api/positions/foo')
        .set('authorization', `Bearer ${token}XX`)
        .then(function(res) {
          expect(res).to.have.status(401);
        });
    });
    it('Should reject requests with an invalid /:id', function() {
      return chai.request(app)
        .delete('/api/positions/foo')
        .set('authorization', `Bearer ${token}`)
        .then(function(res) {
          expect(res).to.have.status(422);
        });
    });
    it('Should delete the correct position', function() {
      
      // Create an application
      return chai.request(app)
        .post('/api/positions')
        .set('authorization', `Bearer ${token}`)
        .send({
          title: faker.name.jobTitle(),
          description: faker.lorem.paragraphs(2),
          dateCreated: new Date(),
          currentlyOpen: Math.random() > .5 ? true : false,
          orgProf: testOrg._id
        })
        .then (
          // Application created, now delete it & test
          function(position) {
            const testURL = `/api/positions/${position.body._id}`;
            return chai.request(app)
            .delete(testURL)
            .set('authorization', `Bearer ${token}`)
            .then(
              function(res) {
                expect(res).to.have.status(202);
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
    });
  });

});


