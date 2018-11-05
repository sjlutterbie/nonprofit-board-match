'use strict';


// Load required components
const {indProfSchema, IndProf} = require('../../server/api/indProf');

describe.only('IndProf API', function() {
  
  describe('Data model', function() {
  
    it('Should be an object', function() {
      expect(indProfSchema).to.be.an('object');
    });
    
    it('IndProf should include the expected keys', function() {
      const requiredKeys = ['firstName', 'lastName', 'email', 'phone',
                            'linkedIn', 'userAccount'];
      expect(indProfSchema.obj).to.include.keys(requiredKeys);
    });

  });
  
  describe('Routes', function() {
  
    describe('GET /api/indprofs/:id', function() {
      
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
        IndProf.create(
          {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            userAccount: testIds.userId
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
                  expect(res).to.be.a('object');
                  expect(res[0]).to.deep.equal(indProf[0]);
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
    
    describe('GET /api/indprofs/:id/apps', function() {
      
      let testUrl = `/api/indprofs/foo/apps`;
      
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
        return chai.request(app)
          .get(testUrl)
          .set('authorization', `Bearer ${expiredToken}`)
          .then(function(res) {
            expect(res).to.have.status(401);
          });
      });
      
    });
    
    describe('POST /api/indprofs', function() {
  
      it('Should reject requests with no JWT', function() {
        return chai.request(app)
          .post('/api/indprofs')
          .send({
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            phone: faker.phone.phoneNumber(),
            linkedIn: faker.internet.url(),
            userAccount: testIds.userId
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
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            phone: faker.phone.phoneNumber(),
            linkedIn: faker.internet.url(),
            userAccount: testIds.userId
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
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            phone: faker.phone.phoneNumber(),
            linkedIn: faker.internet.url(),
            userAccount: testIds.userId
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
            firstName: faker.name.firstName(),
            email: faker.internet.email(),
            phone: faker.phone.phoneNumber(),
            linkedIn: faker.internet.url(),
            userAccount: testIds.userId
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
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            phone: faker.phone.phoneNumber(),
            linkedIn: faker.internet.url(),
            userAccount: testIds.userId
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
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            phone: faker.phone.phoneNumber(),
            linkedIn: faker.internet.url()
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
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            phone: faker.phone.phoneNumber(),
            linkedIn: faker.internet.url(),
            userAccount: testIds.userId
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
            firstName: faker.name.firstName(),
            lastName: 1234,
            email: faker.internet.email(),
            phone: faker.phone.phoneNumber(),
            linkedIn: faker.internet.url(),
            userAccount: testIds.userId
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
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: 1234,
            phone: faker.phone.phoneNumber(),
            linkedIn: faker.internet.url(),
            userAccount: testIds.userId
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
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            phone: 1234,
            linkedIn: faker.internet.url(),
            userAccount: testIds.userId
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
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            phone: faker.phone.phoneNumber(),
            linkedIn: 1234,
            userAccount: testIds.userId
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
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            phone: faker.phone.phoneNumber(),
            linkedIn: faker.internet.url(),
            userAccount: 'NotAUserId'
          })
          .set('authorization', `Bearer ${token}`)
          .then(function(res) {
            expect(res).to.have.status(500);
          });
      });
      it('Should create a new indProf', function() {
        
        const testUser = {
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          email: faker.internet.email(),
          phone: faker.phone.phoneNumber(),
          linkedIn: faker.internet.url(),
          userAccount: testIds.userId
        };
        
        return chai.request(app)
          .post('/api/indprofs')
          .set('content-type', 'application/json')
          .send({
            firstName: testUser.firstName,
            lastName: testUser.lastName,
            email: testUser.email,
            phone: testUser.phone,
            linkedIn: testUser.linkedIn,
            userAccount: mongoose.Types.ObjectId(testUser.userAccount)
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
        
        const testUser = {
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          email: faker.internet.email(),
          phone: faker.phone.phoneNumber(),
          linkedIn: faker.internet.url(),
          userAccount: testIds.userId
        };
        
        return chai.request(app)
          .post('/api/indprofs')
          .set('content-type', 'application/json')
          .send({
            firstName: `    ${testUser.firstName}    `,
            lastName: `  ${testUser.lastName}  `,
            email: testUser.email,
            phone: testUser.phone,
            linkedIn: testUser.linkedIn,
            userAccount: testUser.userAccount
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
            return IndProf.findOne({
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
    
    describe('PUT /api/indprofs/:id', function() {
      
      // Requires existing indProf
      before(function() {
        return new Promise(function(resolve, reject) {
          IndProf.create(
            {
              firstName: faker.name.firstName(),
              lastName: faker.name.lastName(),
              email: faker.internet.email(),
              linkedIn: faker.internet.url(),
              phone: faker.phone.phoneNumber(),
              userAccount: testIds.userId
            })
            .then(function(indProf) {
              testIds.indProfId = indProf._id;
              resolve();
            })
            .catch(function(err) {
              return err;
            });
        });
      });
      
      it('Should reject requests with no JWT', function() {
        return chai.request(app)
          .put(`/api/indprofs/${testIds.indProfId}`)
          .send({
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            phone: faker.phone.phoneNumber(),
            linkedIn: faker.internet.url(),
            userAccount: testIds.userId,
            indProfId: testIds.indProfId
          })
          .then(function(res) {
            expect(res).to.have.status(401);
          });
      });
      it('Should reject users with an incorrect JWT', function() {
        return chai.request(app)
          .put(`/api/indprofs/${testIds.indProfId}`)
          .set('authorization', `Bearer ${token}XX`)
          .send({
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            phone: faker.phone.phoneNumber(),
            linkedIn: faker.internet.url(),
            userAccount: testIds.userId,
            indProfId: testIds.indProfId
          })
          .then(function(res) {
            expect(res).to.have.status(401);
        });
      });
      
      it('Should reject submissions with a missing firstName', function() {
        return chai.request(app)
          .put(`/api/indprofs/${testIds.indProfId}`)
          .set('authorization', `Bearer ${token}`)
          .send({
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            phone: faker.phone.phoneNumber(),
            linkedIn: faker.internet.url(),
            userAccount: testIds.userId,
            indProfId: testIds.indProfId
          })
          .then(function(res) {
            expect(res).to.have.status(422);
        });
      });
      it('Should reject submissions with a missing lastName', function() {
        return chai.request(app)
          .put(`/api/indprofs/${testIds.indProfId}`)
          .set('authorization', `Bearer ${token}`)
          .send({
            firstName: faker.name.firstName(),
            email: faker.internet.email(),
            phone: faker.phone.phoneNumber(),
            linkedIn: faker.internet.url(),
            userAccount: testIds.userId,
            indProfId: testIds.indProfId
          })
          .then(function(res) {
            expect(res).to.have.status(422);
        });
      });
      it('Should reject submissions with a missing email', function() {
        return chai.request(app)
          .put(`/api/indprofs/${testIds.indProfId}`)
          .set('authorization', `Bearer ${token}`)
          .send({
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            phone: faker.phone.phoneNumber(),
            linkedIn: faker.internet.url(),
            userAccount: testIds.userId,
            indProfId: testIds.indProfId
          })
          .then(function(res) {
            expect(res).to.have.status(422);
        });
      });
      it('Should reject submissions with an missing userAccount', function() {
        return chai.request(app)
          .put(`/api/indprofs/${testIds.indProfId}`)
          .set('authorization', `Bearer ${token}`)
          .send({
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            phone: faker.phone.phoneNumber(),
            linkedIn: faker.internet.url(),
            indProfId: testIds.indProfId
          })
          .then(function(res) {
            expect(res).to.have.status(422);
        });
      });
      it('Should reject submissions with an missing indProfId', function() {
        return chai.request(app)
          .put(`/api/indprofs/${testIds.indProfId}`)
          .set('authorization', `Bearer ${token}`)
          .send({
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            phone: faker.phone.phoneNumber(),
            linkedIn: faker.internet.url(),
            userAccount: testIds.userId
          })
          .then(function(res) {
            expect(res).to.have.status(422);
        });
      });
  
      it('Should reject submissions with an empty string firstName', function() {
        return chai.request(app)
          .put(`/api/indprofs/${testIds.indProfId}`)
          .set('authorization', `Bearer ${token}`)
          .send({
            firstName: '',
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            phone: faker.phone.phoneNumber(),
            linkedIn: faker.internet.url(),
            userAccount: testIds.userId,
            indProfId: testIds.indProfId
          })
          .then(function(res) {
            expect(res).to.have.status(422);
        });
      });
      it('Should reject submissions with an empty string lastName', function() {
        return chai.request(app)
          .put(`/api/indprofs/${testIds.indProfId}`)
          .set('authorization', `Bearer ${token}`)
          .send({
            firstName: faker.name.firstName(),
            lastName: '',
            email: faker.internet.email(),
            phone: faker.phone.phoneNumber(),
            linkedIn: faker.internet.url(),
            userAccount: testIds.userId,
            indProfId: testIds.indProfId
          })
          .then(function(res) {
            expect(res).to.have.status(422);
        });
      });
      it('Should reject submissions with an empty string email', function() {
        return chai.request(app)
          .put(`/api/indprofs/${testIds.indProfId}`)
          .set('authorization', `Bearer ${token}`)
          .send({
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: '',
            phone: faker.phone.phoneNumber(),
            linkedIn: faker.internet.url(),
            userAccount: testIds.userId,
            indProfId: testIds.indProfId
          })
          .then(function(res) {
            expect(res).to.have.status(422);
        });
      });
      it('Should reject submissions with an empty string userAccount', function() {
        return chai.request(app)
          .put(`/api/indprofs/${testIds.indProfId}`)
          .set('authorization', `Bearer ${token}`)
          .send({
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            phone: faker.phone.phoneNumber(),
            linkedIn: faker.internet.url(),
            userAccount: '',
            indProfId: testIds.indProfId
          })
          .then(function(res) {
            expect(res).to.have.status(422);
        });
      });
      it('Should reject submissions with an empty string indProfId', function() {
        return chai.request(app)
          .put(`/api/indprofs/${testIds.indProfId}`)
          .set('authorization', `Bearer ${token}`)
          .send({
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            phone: faker.phone.phoneNumber(),
            linkedIn: faker.internet.url(),
            userAccount: testIds.userId,
            indProfId: ''
          })
          .then(function(res) {
            expect(res).to.have.status(422);
        });
      });
  
      it('Should reject submissions where :/id != indProfId', function() {
        return chai.request(app)
          .put(`/api/indprofs/${testIds.indProfId}XX`)
          .set('authorization', `Bearer ${token}`)
          .send({
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            phone: faker.phone.phoneNumber(),
            linkedIn: faker.internet.url(),
            userAccount: testIds.userId,
            indProfId: testIds.indProfId
          })
          .then(function(res) {
            expect(res).to.have.status(422);
        });
      });
      
      it('Should reject requests with an invalid :/id', function() {
        return chai.request(app)
          .put(`/api/indprofs/${testIds.indProfId}XX`)
          .set('authorization', `Bearer ${token}`)
          .send({
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            phone: faker.phone.phoneNumber(),
            linkedIn: faker.internet.url(),
            userAccount: testIds.userId,
            indProfId: testIds.indProfId + 'XX'
          })
          .then(function(res) {
            expect(res).to.have.status(500);
        });
      });
      
      it('Should successfully update a valid request', function() {
        
        // Test indProf required for evaluating response
        const testUser = {
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          email: faker.internet.email(),
          phone: faker.phone.phoneNumber(),
          linkedIn: faker.internet.url(),
          userAccount: testIds.userId,
          indProfId: testIds.indProfId
        };
        
        return chai.request(app)
          .put(`/api/indprofs/${testUser.indProfId}`)
          .set('authorization', `Bearer ${token}`)
          .send({
            firstName: testUser.firstName,
            lastName: testUser.lastName,
            email: testUser.email,
            phone: testUser.phone,
            linkedIn: testUser.linkedIn,
            userAccount: testUser.userAccount,
            indProfId: testUser.indProfId
          })
          .then(function(res) {
            expect(res).to.have.status(200);
        });
      });
    });
  });
});


