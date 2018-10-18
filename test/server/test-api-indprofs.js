'use strict';

// Load testing tools
const chai = require('chai');
  const expect = chai.expect;


// Load module
const { IndProf } = require('../../server/api/indProf');



describe('IndProfs data model', function() {
  
  it('Should be an object', function() {
    expect(IndProf).to.be.an('object');
  });
  it('IndProf include the expected keys', function() {
    const requiredKeys = ['overview', 'linkedIn', 'experience', 'userAccount'];
    expect(IndProf.obj).to.include.keys(requiredKeys);
  });
  it('IndProf.overview should include the expected keys', function() {
    const requiredKeys = ['firstName', 'lastName', 'email', 'phone'];
    expect(IndProf.obj.overview).to.include.keys(requiredKeys);
  });
  
  
  
});