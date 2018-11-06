'use strict';


// Load required components
const apps = require('../../server/portal/components/applications');

describe('Component: applications', function() {
  
  describe('Controllers', function() {
    
    describe('getApplicationPromise()', function() {
      
      it('Should be a function', function() {
        expect(apps.getApplicationPromise).to.be.a('function');
      });
      it('Should return a promise', function() {
        const appId = faker.random.alphaNumeric(10);
        let testObj = apps.getApplicationPromise(appId);
        expect(testObj).to.be.a('promise');
        // Resolve/reject promise to avoid errors
        testObj.then(function(res){},function(err){});
      });
    });
    
    describe('getIndProfAppsPromise()', function() {
      
      it('Should be a function', function() {
        expect(apps.getIndProfAppsPromise).to.be.a('function');
      });
      it('Should return a promise', function() {
        const indProfId = faker.random.alphaNumeric(10);
        let testObj = apps.getIndProfAppsPromise(indProfId);
        expect(testObj).to.be.a('promise');
        // Resolve/reject promise to avoid errors
        testObj.then(function(res){},function(err){});
      });
      
    });
    
  });
  
  describe('Views', function(){
    
    describe('staticMode()', function() {
      
      it('Should be a function', function() {
        expect(apps.staticMode).to.be.a('function');
      });
      
      it('Should return a string', function(){
        const testApp = {
          coverMessage: faker.random.alphaNumeric(10)
        };
        expect(apps.staticMode(testApp)).to.be.a('string');
      });
    });
    
    describe('createMode()', function() {
      
      it('Should be a function', function() {
        expect(apps.createMode).to.be.a('function');
      });
      
      it('Should return a string', function() {
        expect(apps.createMode()).to.be.a('string');
      });
    });
    
    describe('listMode()', function() {
      
      it('Should be a function', function() {
        expect(apps.listMode).to.be.a('function');
      });
      
      it('Should return a string', function() {
        const applications = [];
        expect(apps.listMode(applications)).to.be.a('string');
      });
    });
  });

  describe('Routes', function() {
    
    describe('/apply', function() {
      
      const testUrl = '/portal/components/applications/apply';

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
        // Run the test
        return chai.request(app)
          .get(testUrl)
          .set('authorization', `Bearer ${expiredToken}`)
          .then(function(res) {
            expect(res).to.have.status(401);
          });
      });
      
      it('Should accept an authorized request', function() {
        return chai.request(app)
          .get(testUrl)
          .set('authorization', `Bearer ${token}`)
          .then(function(res) {
            expect(res).to.have.status(200);
            expect(res).to.be.an('object');
          });
      });
    });
    
    describe('GET /apply', function() {

      let testUrl = `/portal/components/applications/viewapp/foo`;

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
        // Run the test
        return chai.request(app)
          .get(testUrl)
          .set('authorization', `Bearer ${expiredToken}`)
          .then(function(res) {
            expect(res).to.have.status(401);
          });
      });
      
      it('Should accept an authorized request', function() {

        testUrl = `/portal/components/applications/viewapp/${testIds.appId}`;
        
        return chai.request(app)
          .get(testUrl)
          .set('authorization', `Bearer ${token}`)
          .then(function(res) {
            expect(res).to.have.status(200);
            expect(res).to.be.an('object');
          });
      });
    });
    
    describe('GET /apps/:id', function() {
      
      let testUrl = `/portal/components/applications/apps/foo`;
      
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
        // Run the test
        return chai.request(app)
          .get(testUrl)
          .set('authorization', `Bearer ${expiredToken}`)
          .then(function(res) {
            expect(res).to.have.status(401);
          });
      });
      
       it('Should accept an authorized request', function() {

        testUrl = `/portal/components/applications/apps/${testIds.indProfId}`;
      
        return chai.request(app)
          .get(testUrl)
          .set('authorization', `Bearer ${token}`)
          .then(function(res) {
            expect(res).to.have.status(200);
            expect(res).to.be.an('object');
          });
      });
      
      
    });
    
    
  });
});