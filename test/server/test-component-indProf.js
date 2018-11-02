'use strict';

// Load required components
const iP = require('../../server/portal/components/indprof');

describe('Component: indprof', function() {
  
  describe('Controllers', function() {

    describe('getIndProfPromise', function() {
      
      it('Should be a function', function() {
        expect(iP.getIndProfPromise).to.be.a('function');
      });
      
      it('Should return a promise', function() {
        const profId = faker.random.alphaNumeric(10);
        let testObj = iP.getIndProfPromise(profId);
        expect(testObj).to.be.a('promise');
        // Resolve/reject promise to avoid errors
        testObj.then(function(res){},function(err){});
      });
      
      // The contents of this resolved promise are tested in the IndProf API
      
    });
  });
  
  describe('Views', function() {
    
    describe('editMode()', function() {
      
      it('Should be a function', function() {
        expect(iP.editMode).to.be.a('function');
      });
      
      it('Should return a string', function() {
        const userData = {
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          email: faker.internet.email(),
          phone: faker.phone.phoneNumber(),
          linkedIn: faker.internet.url()
        };
        expect(iP.editMode(userData)).to.be.a('string');
      });
    });
    
    describe('createMode()', function() {

      it('Should be a function', function() {
        expect(iP.createMode).to.be.a('function');
      });

      it('Should return a string', function() {
        const userData = {
          userId: faker.random.alphaNumeric(10)
        };
        expect(iP.createMode(userData)).to.be.a('string');
      });
    });
    
    describe('staticMode()', function() {
      
      it('Should be a function', function() {
        expect(iP.staticMode).to.be.a('function');
      });
      
      it('Should return a string', function() {
        const userData = {
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          email: faker.internet.email(),
          phone: faker.phone.phoneNumber(),
          linkedIn: faker.internet.url(),
          userAccount: faker.random.alphaNumeric(10),
          _id: faker.random.alphaNumeric(10)
        };
        expect(iP.staticMode(userData)).to.be.a('string');
      });
    });
  });
  
  describe('Routes', function() {

    describe('GET /portal/components/indprof', function() {
      
      const testUrl = '/portal/components/indprof';

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
      
      it('Should reject requests with missing query variables', function() {
        const testCases = [
          // No values
          '',
          // Missing mode
          `?indProf=${testIds.indpRofId}&userId=${testIds.userId}`,
          // Missing userProf
          `?mode=static&indProf=${testIds.indpRofId}`
        ];
        testCases.forEach(function(testCase) {
          const wrongUrl = testUrl + testCase;
          return chai.request(app)
            .get(wrongUrl)
            .set('authorization', `Bearer ${token}`)
            .then(function(res) {
              expect(res).to.have.status(422);
          });
        });
      });
      
      it('Should reject requests with invalid query values', function() {
        const testCases = [
          // Incorrect mode
          `?mode=XXX&userId=${testIds.userId}&profId=${testIds.indProfId}`,
          // Incorrect userId
          `?mode=static&userId=XXX&profId=${testIds.indProfId}`
        ];
        testCases.forEach(function(testCase) {
          const wrongUrl = testUrl + testCase;
          return chai.request(app)
            .get(wrongUrl)
            .set('authorization', `Bearer ${token}`)
            .then(function(res) {
              expect(res).to.have.status(422);
            });
        });
      });
      
      it('Should accept an authorized request for each mode', function() {
        const testCases = ['static', 'edit', 'create'];
        testCases.forEach(function(testCase) {
          const goodUrl = testUrl + 
            `?mode=${testCase}&userId=${testIds.userId}&profId=${testIds.indProfId}`;
          return chai.request(app)
            .get(goodUrl)
            .set('authorization', `Bearer ${token}`)
            .then(function(res) {
              expect(res).to.have.status(200);
              expect(res).to.be.an('object');
              expect(res.text).to.be.a('string');
            });
        });
      });
    });
  });
});