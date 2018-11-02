'use strict';

// Load required components
const pos = require('../../server/portal/components/positions');

describe('Component: positions', function() {
  
  describe('Controllers', function() {
    
    describe('getOpenPositionsPromise', function() {
      
      it('Should be a function', function() {
        expect(pos.getOpenPositionsPromise).to.be.a('function');
      });
      
      it('Should return a promise', function() {
        let testObj = pos.getOpenPositionsPromise();
        expect(testObj).to.be.a('promise');
        // Resolve/reject promise to avoid errors
        testObj.then(function(res){},function(err){});
      });
      
      // The contents of this resolved promise are tested in the Position API
      
    });
    
    describe('getSinglePositionPromise()', function(){
      
      it('Should be a function', function() {
        expect(pos.getSinglePositionPromise).to.be.a('function');
      });
      
      it('Should return a promise', function() {
        const posId = faker.random.alphaNumeric(10);
        let testObj = pos.getSinglePositionPromise(posId);  
        expect(testObj).to.be.a('promise');
        // Resolve/reject promise to avoid errors
        testObj.then(function(res){},function(err){});
      });
    });
    
    describe('hasIndProfApplied()', function() {
      it('Should be a function', function() {
        expect(pos.hasIndProfApplied).to.be.a('function');
      });
      it('Should correctly find/reject a target application', function() {
        const targetIndProf = faker.random.alphaNumeric(10);
        const testCases = [
          // Position has no applications
          [{applications: []}, undefined],
          // Position has an irrelevant application
          [{applications: [{indProf: targetIndProf+'X'}]}, undefined],
          // Position has a relevant application
          [{applications: [{indProf: targetIndProf}]}, {indProf: targetIndProf}]
        ];
        testCases.forEach(function(testCase) {
          expect(pos.hasIndProfApplied(testCase[0], targetIndProf))
            .to.deep.equal(testCase[1]);
        });
      });
    });
  });
  
  describe('Views', function(){
    
    describe('staticMode', function() {
      
      it('Should be a function', function() {
        expect(pos.staticMode).to.be.a('function');
      });
      
      it('Should return a string', function() {
        const testPositions = [
          {
            title: faker.random.alphaNumeric(10),
            orgProf: {
              name: faker.random.alphaNumeric(10)
            },
            description: faker.random.alphaNumeric(10)
          }
        ];
        expect(pos.staticMode(testPositions)).to.be.a('string');
      });
    });
    
    describe('makeStaticPosition()', function() {
      
      it('Should be a function', function() {
        expect(pos.makeStaticPosition).to.be.a('function');
      });
      
      it('Should return a string', function() {
        const testPosition = {
          title: faker.random.alphaNumeric(10),
          orgProf: {
            name: faker.random.alphaNumeric(10)
          },
          description: faker.random.alphaNumeric(10)
        };
        expect(pos.makeStaticPosition(testPosition)).to.be.a('string');
      });
    });
  });

  describe('Routes', function() {
    
    describe('GET /portal/components/positions', function() {
      
      const testUrl = '/portal/components/positions';

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
      
      it('Should accept an authorized request', function() {
          return chai.request(app)
            .get(testUrl)
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