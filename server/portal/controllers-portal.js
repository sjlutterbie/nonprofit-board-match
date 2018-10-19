'use strict';

function portalBuildSelector(profType, profId) {

  // If the profId is undefined, go to create mode.
  const viewType = profId ? 'Static' : 'Create'; 

  // Create the viewType string  
  const buildType = profType + '-' + viewType;

  return buildType;  
  
}


module.exports = {
  portalBuildSelector
};