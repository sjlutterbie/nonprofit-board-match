'use strict';

const {Application, applicationsSchema} = require('../../server/api/applications');
const {IndProf} = require('../../server/api/indProf');
const {Position} = require('../../server/api/positions');


describe('Applications API', function() {
  
  describe('Data model', function() {
    
    it('Should be an object', function() {
      expect(applicationsSchema).to.be.an('object');
    });
    it('Application should include the expected keys', function() {
      const requiredKeys = ['coverMessage', 'applicationDate', 'position',
        'indProf'];
      expect(applicationsSchema.obj).to.include.keys(requiredKeys);
    });
  
  });

  describe('Routes', function() {
  
    describe('GET /api/applications?queryString...', function() {
      it('Should reject requests with no JWT', function() {
        return chai.request(app)
          .get('/api/applications')
          .then(function(res) {
            expect(res).to.have.status(401);
          });
      });
      it('Should reject requests with an incorrect JWT', function() {
        return chai.request(app)
          .get('/api/applications')
          .set('authorization', `Bearer ${token}XX`)
          .then(function(res) {
            expect(res).to.have.status(401);
          });
      });
      
      it('Should reject requests without a query string', function() {
        return chai.request(app)
          .get('/api/applications')
          .set('authorization', `Bearer ${token}`)
          .then(function(res) {
            expect(res).to.have.status(422);
        });
      });
      it('Should return the correct result when searching by posId', function() {
        // Create an application
        Application.create(
          {
            coverMessage: faker.lorem.paragraphs(2),
            applicationDate: new Date(),
            position:testIds.posId,
            indProf: testIds.indProfId
          }  
        ).then(
          // If successful, run API call
          function(application) {
            const testURL = `/api/applications?position=${testIds.posId}`;
            return chai.request(app)
              .get(testURL)
              .set('authorization', `Bearer ${token}`)
              .then(
                function(res) {
                  expect(res).to.have.status(200);
                  expect(res.body).to.be.an('array');
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
      it('Should return the correct result when searching by indProf', function() {
        // Create an application
        Application.create(
          {
            coverMessage: faker.lorem.paragraphs(2),
            applicationDate: new Date(),
            position:testIds.posId,
            indProf: testIds.indProfId
          }  
        ).then(
          // If successful, run API call
          function(application) {
            const testURL = `/api/applications?indProf=${testIds.indProfId}`;
            return chai.request(app)
              .get(testURL)
              .set('authorization', `Bearer ${token}`)
              .then(
                function(res) {
                  expect(res).to.have.status(200);
                  expect(res.body).to.be.an('array');
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
      it('Should return the correct result when searching by indProf and position',
        function() {
        // Create an application
        Application.create(
          {
            coverMessage: faker.lorem.paragraphs(2),
            applicationDate: new Date(),
            position:testIds.posId,
            indProf: testIds.indProfId
          }  
        ).then(
          // If successful, run API call
          function(application) {
            const testURL =
              `/api/applications?indProf=${testIds.indProfId}&position=${testIds.posId}`;
            return chai.request(app)
              .get(testURL)
              .set('authorization', `Bearer ${token}`)
              .then(
                function(res) {
                  expect(res).to.have.status(200);
                  expect(res.body).to.be.an('array');
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
  
    describe('GET /api/applications/:id', function() {
   
      it('Should reject requests with no JWT', function() {
        return chai.request(app)
          .get('/api/applications/foo')
          .then(function(res) {
            expect(res).to.have.status(401);
          });
      });
      it('Should reject requests with an incorrect JWT', function() {
        return chai.request(app)
          .get('/api/applications/foo')
          .set('authorization', `Bearer ${token}XX`)
          .then(function(res) {
            expect(res).to.have.status(401);
          });
      });
      it('Should reject requests with an invalid /:id', function() {
        return chai.request(app)
          .get('/api/applications/foo')
          .set('authorization', `Bearer ${token}`)
          .then(function(res) {
            expect(res).to.have.status(422);
          });
      });
      
      it('Should return the correct Application', function() {
        // Create an application
        Application.create(
          {
            coverMessage: faker.lorem.paragraphs(2),
            applicationDate: new Date(),
            position: testIds.posId,
            indProf: testIds.indProf
          }  
        ).then(
          // If successful, run API call
          function(application) {
            const testURL = `api/applications${application._id}`;
            return chai.request(app)
              .get(testURL)
              .set('authorization', `Bearer ${token}`)
              .then(
                function(res) {
                  expect(res).to.have.status(200);
                  expect(res).to.be.a('object');
                  expect(res[0]).to.deep.equal(application[0]);
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
    
    describe('POST /api/application', function() {
      
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
    
    describe('DELETE /api/application/:id', function() {
    
      it('Should reject requests with no JWT', function() {
        return chai.request(app)
          .delete('/api/applications/foo')
          .then(function(res) {
            expect(res).to.have.status(401);
          });
      });
      it('Should reject requests with an incorrect JWT', function() {
        return chai.request(app)
          .delete('/api/applications/foo')
          .set('authorization', `Bearer ${token}XX`)
          .then(function(res) {
            expect(res).to.have.status(401);
          });
      });
      it('Should reject requests with an invalid /:id', function() {
        return chai.request(app)
          .delete('/api/applications/foo')
          .set('authorization', `Bearer ${token}`)
          .then(function(res) {
            expect(res).to.have.status(422);
          });
      });
      it('Should delete the correct application', function() {
        
        // Create an application
        return chai.request(app)
          .post('/api/applications')
          .set('authorization', `Bearer ${token}`)
          .send({
            coverMessage: faker.lorem.paragraphs(2),
            applicationDate: new Date(),
            indProf: testIds.indProfId,
            position: testIds.posId
          })
          .then (
            // Application created, now delete it & test
            function(application) {
              const appId = application.body._id;
              const testURL = `/api/applications/${application.body._id}`;
              return chai.request(app)
              .delete(testURL)
              .set('authorization', `Bearer ${token}`)
              .then(
                function(res) {
                  expect(res).to.have.status(202);
                  // Confirm _id is removed from position and indProf
                  return Position.findById(testIds.posId)
                    .then(function(position) {
                      expect(position.applications).to.not.include(appId);
                    },
                    function(err) {
                      return err;
                    });
                  return IndProf.findById(testIds.indProfId)
                    .then(function(profile){
                      expect(profile.applications).to.not.include(appId);
                    },
                    function(err) {
                      return err;
                    });
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
});