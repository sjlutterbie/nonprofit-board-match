'use strict';

// Load required components
const {OrgProf, orgProfSchema} = require('../../server/api/orgProf');
const {User} = require('../../server/api/users');

describe('OrgProf API', function() {
  
  describe('Data model', function() {
  
    it('Should be an object', function() {
      expect(orgProfSchema).to.be.an('object');
    });
  
    it('OrgProf should include the expected keys', function() {
      const requiredKeys = ['name', 'website', 'email', 'phone', 'summary',
        'userAccount', 'positions'];
      expect(orgProfSchema.obj).to.include.keys(requiredKeys);
    });
  });
  
  describe('Routes', function() {

    describe('GET /api/orgprofs/:id', function() {
    
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
        // Create an OrgProf
        OrgProf.create(
          {
            name: faker.company.companyName(),
            website: faker.internet.url(),
            email: faker.internet.email(),
            phone: faker.phone.phoneNumber(),
            summary: faker.lorem.paragraphs(2),
            userAccount: testIds.userId
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
      
      it('Should reject requests with no JWT', function() {
        return chai.request(app)
          .post('/api/orgprofs')
          .send({
            name: faker.company.companyName(),
            website: faker.internet.url(),
            email: faker.internet.email(),
            phone: faker.phone.phoneNumber(),
            summary: faker.lorem.paragraphs(2),
            userAccount: testIds.userId
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
            userAccount: testIds.userId
          })
          .then(function(res) {
            expect(res).to.have.status(401);
        });
      });
      
      it('Should reject submissions with a missing name', function() {
        return chai.request(app)
          .post('/api/orgprofs')
          .set('authorization', `Bearer ${token}`)
          .set('content-type', 'application/json')
          .send({
            website: faker.internet.url(),
            email: faker.internet.email(),
            phone: faker.phone.phoneNumber(),
            summary: faker.lorem.paragraphs(2),
            userAccount: testIds.userId
          })
          .set('authorization', `Bearer ${token}`)
          .then(function(res) {
            expect(res).to.have.status(422);
          });
      });
      
      it('Should reject submissions with a missing email', function() {
        return chai.request(app)
          .post('/api/orgprofs')
          .set('authorization', `Bearer ${token}`)
          .set('content-type', 'application/json')
          .send({
            name: faker.company.companyName(),
            website: faker.internet.url(),
            phone: faker.phone.phoneNumber(),
            summary: faker.lorem.paragraphs(2),
            userAccount: testIds.userId
          })
          .set('authorization', `Bearer ${token}`)
          .then(function(res) {
            expect(res).to.have.status(422);
          });
      });
      
      it('Should reject submissions with a missing userAccount', function() {
        return chai.request(app)
          .post('/api/orgprofs')
          .set('authorization', `Bearer ${token}`)
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
          .set('authorization', `Bearer ${token}`)
          .set('content-type', 'application/json')
          .send({
            name: 1234,
            website: faker.internet.url(),
            email: faker.internet.email(),
            phone: faker.phone.phoneNumber(),
            summary: faker.lorem.paragraphs(2),
            userAccount: testIds.userId
          })
          .set('authorization', `Bearer ${token}`)
          .then(function(res) {
            expect(res).to.have.status(422);
          });
      });
      
      it('Should reject submissions with a non-string website', function() {
        return chai.request(app)
          .post('/api/orgprofs')
          .set('authorization', `Bearer ${token}`)
          .set('content-type', 'application/json')
          .send({
            name: faker.company.companyName(),
            website: 1234,
            email: faker.internet.email(),
            phone: faker.phone.phoneNumber(),
            summary: faker.lorem.paragraphs(2),
            userAccount: testIds.userId
          })
          .set('authorization', `Bearer ${token}`)
          .then(function(res) {
            expect(res).to.have.status(422);
          });
      });
      
      it('Should reject submissions with a non-string email', function() {
        return chai.request(app)
          .post('/api/orgprofs')
          .set('authorization', `Bearer ${token}`)
          .set('content-type', 'application/json')
          .send({
            name: faker.company.companyName(),
            website: faker.internet.url(),
            email: 1234,
            phone: faker.phone.phoneNumber(),
            summary: faker.lorem.paragraphs(2),
            userAccount: testIds.userId
          })
          .set('authorization', `Bearer ${token}`)
          .then(function(res) {
            expect(res).to.have.status(422);
          });
      });
      
      it('Should reject submissions with a non-string name', function() {
        return chai.request(app)
          .post('/api/orgprofs')
          .set('authorization', `Bearer ${token}`)
          .set('content-type', 'application/json')
          .send({
            name: faker.company.companyName(),
            website: faker.internet.url(),
            email: faker.internet.email(),
            phone: 1234,
            summary: faker.lorem.paragraphs(2),
            userAccount: testIds.userId
          })
          .set('authorization', `Bearer ${token}`)
          .then(function(res) {
            expect(res).to.have.status(422);
          });
      });
      
      it('Should reject submissions with a non-string name', function() {
        return chai.request(app)
          .post('/api/orgprofs')
          .set('authorization', `Bearer ${token}`)
          .set('content-type', 'application/json')
          .send({
            name: faker.company.companyName(),
            website: faker.internet.url(),
            email: faker.internet.email(),
            phone: faker.phone.phoneNumber(),
            summary: 1234,
            userAccount: testIds.userId
          })
          .set('authorization', `Bearer ${token}`)
          .then(function(res) {
            expect(res).to.have.status(422);
          });
      });
      
      it('Should reject submissions with an invalid userAccount', function() {
        return chai.request(app)
          .post('/api/orgprofs')
          .set('authorization', `Bearer ${token}`)
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
          userAccount: testIds.userId
        };
    
        return chai.request(app)
          .post('/api/orgprofs')
          .set('authorization', `Bearer ${token}`)
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
          userAccount: testIds.userId
        };
    
        return chai.request(app)
          .post('/api/orgprofs')
          .set('authorization', `Bearer ${token}`)
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
  
    describe('PUT /api/orgprofs/:id', function() {
      
      // Requires existing indProf
      before(function() {
        return new Promise(function(resolve, reject) {
          OrgProf.create(
            {
              name: faker.company.companyName(),
              website: faker.internet.url(),
              email: faker.internet.email(),
              phone: faker.phone.phoneNumber(),
              summary: faker.lorem.paragraphs(2),
              userAccount: testIds.userId
            })
            .then(function(orgProf) {
              testIds.orgProfId = orgProf._id;
              resolve();
            })
            .catch(function(err) {
              return err;
            });
        });
      });
      
      it('Should reject requests with no JWT', function() {
        return chai.request(app)
          .put(`/api/orgprofs/${testIds.orgProfId}`)
          .send({
              name: faker.company.companyName(),
              website: faker.internet.url(),
              email: faker.internet.email(),
              phone: faker.phone.phoneNumber(),
              summary: faker.lorem.paragraphs(2),
              userAccount: testIds.userId,
              orgProfId: testIds.orgProfId
          })
          .then(function(res) {
            expect(res).to.have.status(401);
          });
      });
      
      it('Should reject requests with an incorrect JWT', function() {
        return chai.request(app)
          .put(`/api/orgprofs/${testIds.orgProfId}`)
          .set('authorization', `Bearer ${token}XX`)
          .send({
              name: faker.company.companyName(),
              website: faker.internet.url(),
              email: faker.internet.email(),
              phone: faker.phone.phoneNumber(),
              summary: faker.lorem.paragraphs(2),
              userAccount: testIds.userId,
              orgProfId: testIds.orgProfId
          })
          .then(function(res) {
            expect(res).to.have.status(401);
          });
      });
      
      it('Should reject requests with a missing name', function() {
        return chai.request(app)
          .put(`/api/orgprofs/${testIds.orgProfId}`)
          .set('authorization', `Bearer ${token}`)
          .send({
              website: faker.internet.url(),
              email: faker.internet.email(),
              phone: faker.phone.phoneNumber(),
              summary: faker.lorem.paragraphs(2),
              userAccount: testIds.userId,
              orgProfId: testIds.orgProfId
          })
          .then(function(res) {
            expect(res).to.have.status(422);
          });
      });
      
      it('Should reject requests with a missing email', function() {
        return chai.request(app)
          .put(`/api/orgprofs/${testIds.orgProfId}`)
          .set('authorization', `Bearer ${token}`)
          .send({
              name: faker.company.companyName(),
              website: faker.internet.url(),
              phone: faker.phone.phoneNumber(),
              summary: faker.lorem.paragraphs(2),
              userAccount: testIds.userId,
              orgProfId: testIds.orgProfId
          })
          .then(function(res) {
            expect(res).to.have.status(422);
          });
      });
      
      it('Should reject requests with a missing userAccount', function() {
        return chai.request(app)
          .put(`/api/orgprofs/${testIds.orgProfId}`)
          .set('authorization', `Bearer ${token}`)
          .send({
              name: faker.company.companyName(),
              website: faker.internet.url(),
              email: faker.internet.email(),
              phone: faker.phone.phoneNumber(),
              summary: faker.lorem.paragraphs(2),
              orgProfId: testIds.orgProfId
          })
          .then(function(res) {
            expect(res).to.have.status(422);
          });
      });
      
      it('Should reject requests with a missing orgProfId', function() {
        return chai.request(app)
          .put(`/api/orgprofs/${testIds.orgProfId}`)
          .set('authorization', `Bearer ${token}`)
          .send({
              name: faker.company.companyName(),
              website: faker.internet.url(),
              email: faker.internet.email(),
              phone: faker.phone.phoneNumber(),
              summary: faker.lorem.paragraphs(2),
              userAccount: testIds.userId
          })
          .then(function(res) {
            expect(res).to.have.status(422);
          });
      });
      
      it('Should reject requests with a non-string name', function() {
        return chai.request(app)
          .put(`/api/orgprofs/${testIds.orgProfId}`)
          .set('authorization', `Bearer ${token}`)
          .send({
              name: 1234,
              website: faker.internet.url(),
              email: faker.internet.email(),
              phone: faker.phone.phoneNumber(),
              summary: faker.lorem.paragraphs(2),
              userAccount: testIds.userId,
              orgProfId: testIds.orgProfId
          })
          .then(function(res) {
            expect(res).to.have.status(422);
          });
      });
      
      it('Should reject requests with a non-string email', function() {
        return chai.request(app)
          .put(`/api/orgprofs/${testIds.orgProfId}`)
          .set('authorization', `Bearer ${token}`)
          .send({
              name: faker.company.companyName(),
              website: faker.internet.url(),
              phone: faker.phone.phoneNumber(),
              summary: faker.lorem.paragraphs(2),
              userAccount: testIds.userId,
              orgProfId: testIds.orgProfId
          })
          .then(function(res) {
            expect(res).to.have.status(422);
          });
      });
      
      it('Should reject requests with a non-string email', function() {
        return chai.request(app)
          .put(`/api/orgprofs/${testIds.orgProfId}`)
          .set('authorization', `Bearer ${token}`)
          .send({
              name: faker.company.companyName(),
              website: faker.internet.url(),
              email: 1234,
              phone: faker.phone.phoneNumber(),
              summary: faker.lorem.paragraphs(2),
              userAccount: testIds.userId,
              orgProfId: testIds.orgProfId
          })
          .then(function(res) {
            expect(res).to.have.status(422);
          });
      });
      
      it('Should reject requests with a non-string phone', function() {
        return chai.request(app)
          .put(`/api/orgprofs/${testIds.orgProfId}`)
          .set('authorization', `Bearer ${token}`)
          .send({
              name: faker.company.companyName(),
              website: faker.internet.url(),
              email: faker.internet.email(),
              phone: 1234,
              summary: faker.lorem.paragraphs(2),
              userAccount: testIds.userId,
              orgProfId: testIds.orgProfId
          })
          .then(function(res) {
            expect(res).to.have.status(422);
          });
      });
      
      it('Should reject requests with a non-string summary', function() {
        return chai.request(app)
          .put(`/api/orgprofs/${testIds.orgProfId}`)
          .set('authorization', `Bearer ${token}`)
          .send({
              name: faker.company.companyName(),
              website: faker.internet.url(),
              email: faker.internet.email(),
              phone: faker.phone.phoneNumber(),
              summary: 1234,
              userAccount: testIds.userId,
              orgProfId: testIds.orgProfId
          })
          .then(function(res) {
            expect(res).to.have.status(422);
          });
      });
      
      it('Should reject requests with an empty-string name', function() {
        return chai.request(app)
          .put(`/api/orgprofs/${testIds.orgProfId}`)
          .set('authorization', `Bearer ${token}`)
          .send({
              name: '',
              website: faker.internet.url(),
              email: faker.internet.email(),
              phone: faker.phone.phoneNumber(),
              summary: faker.lorem.paragraphs(2),
              userAccount: testIds.userId,
              orgProfId: testIds.orgProfId
          })
          .then(function(res) {
            expect(res).to.have.status(422);
          });
      });
      
      it('Should reject requests with an empty-string email', function() {
        return chai.request(app)
          .put(`/api/orgprofs/${testIds.orgProfId}`)
          .set('authorization', `Bearer ${token}`)
          .send({
              name: faker.company.companyName(),
              website: faker.internet.url(),
              email: '',
              phone: faker.phone.phoneNumber(),
              summary: faker.lorem.paragraphs(2),
              userAccount: testIds.userId,
              orgProfId: testIds.orgProfId
          })
          .then(function(res) {
            expect(res).to.have.status(422);
          });
      });
      
      it('Should reject requests with an empty-string userAccount', function() {
        return chai.request(app)
          .put(`/api/orgprofs/${testIds.orgProfId}`)
          .set('authorization', `Bearer ${token}`)
          .send({
              name: faker.company.companyName(),
              website: faker.internet.url(),
              email: faker.internet.email(),
              phone: faker.phone.phoneNumber(),
              summary: faker.lorem.paragraphs(2),
              userAccount: '',
              orgProfId: testIds.orgProfId
          })
          .then(function(res) {
            expect(res).to.have.status(422);
          });
      });
      
      it('Should reject requests with an empty-string orgProfId', function() {
        return chai.request(app)
          .put(`/api/orgprofs/${testIds.orgProfId}`)
          .set('authorization', `Bearer ${token}`)
          .send({
              name: faker.company.companyName(),
              website: faker.internet.url(),
              email: faker.internet.email(),
              phone: faker.phone.phoneNumber(),
              summary: faker.lorem.paragraphs(2),
              userAccount: testIds.userId,
              orgProfId: ''
          })
          .then(function(res) {
            expect(res).to.have.status(422);
          });
      });
      
      it('Should reject requests where /:id != orgProfId', function() {
        return chai.request(app)
          .put(`/api/orgprofs/${testIds.orgProfId}XX`)
          .set('authorization', `Bearer ${token}`)
          .send({
              name: faker.company.companyName(),
              website: faker.internet.url(),
              email: faker.internet.email(),
              phone: faker.phone.phoneNumber(),
              summary: faker.lorem.paragraphs(2),
              userAccount: testIds.userId,
              orgProfId: testIds.orgProfId
          })
          .then(function(res) {
            expect(res).to.have.status(422);
          });
      });
      
      it('Should reject requests with an invalid orgProfId', function() {
        return chai.request(app)
          .put(`/api/orgprofs/${testIds.orgProfId}XX`)
          .set('authorization', `Bearer ${token}`)
          .send({
              name: faker.company.companyName(),
              website: faker.internet.url(),
              email: faker.internet.email(),
              phone: faker.phone.phoneNumber(),
              summary: faker.lorem.paragraphs(2),
              userAccount: testIds.userId + 'XX',
              orgProfId: ''
          })
          .then(function(res) {
            expect(res).to.have.status(422);
          });
      });
      
      it('Should successfully update a valid request', function() {
    
        // Test orgProf required for evaluating responses
        const testOrg = {
          name: faker.company.companyName(),
          website: faker.internet.url(),
          email: faker.internet.email(),
          phone: faker.phone.phoneNumber(),
          summary: faker.lorem.paragraphs(2),
          userAccount: testIds.userId,
          orgProfId: testIds.orgProfId
        };
    
        return chai.request(app)
          .put(`/api/orgprofs/${testIds.orgProfId}`)
          .set('authorization', `Bearer ${token}`)
          .send({
            name: testOrg.name,
            website: testOrg.website,
            email: testOrg.email,
            phone: testOrg.phone,
            summary: testOrg.summary,
            userAccount: testOrg.userAccount,
            orgProfId: testIds.orgProfId
          })
          .then(function(res) {
            expect(res).to.have.status(204);
          });
        });
      });
    });
  });
});