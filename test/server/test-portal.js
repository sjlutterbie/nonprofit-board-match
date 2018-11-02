'use strict';

// Load required components
const {buildPortal} = require('../../server/portal/portal'); 

describe('Portal: View', function() {
  
  describe('buildPortal()', function() {
    
    it('Should be a function', function() {
      expect(buildPortal).to.be.a('function');
    });

    it('Should return a string', function() {
      // Create test vars
      const userType = faker.random.alphaNumeric(10);
      const profId = faker.random.alphaNumeric(10);
      const userId = faker.random.alphaNumeric(10);
      const profile = faker.random.alphaNumeric(10);
      // Run test
      expect(buildPortal(userType, profId, userId, profile)).to.be.a('string');
    });
  });
  
});