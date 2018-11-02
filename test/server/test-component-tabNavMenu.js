'use strict';

// Load required components
const tabNavMenu = require('../../server/portal/components/tabNavMenu');

describe('tabNavMenu.buildMenu()', function() {
  
  it('Should be a function', function() {
    expect(tabNavMenu.buildMenu).to.be.a('function');
  });
  it('Should return a string', function() {
    expect(tabNavMenu.buildMenu()).to.be.a('string');
  });

});