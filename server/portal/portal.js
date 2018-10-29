'use strict';

const tabNavMenu = require('./components/component-tabNavMenu');
const indProf = require('./components/component-indProf');

function buildPortal(userType, profId, userId, viewType) {
  
  const viewHTML = `
    <header>
      <h1>Board Match Portal</h1>
      <nav class="header-nav js-header-nav">
        This will be the Header Nav
      </nav>
    </header>
    
    <nav class="tab-nav">
      ${tabNavMenu.buildComponent(userType, userId, profId)}
    </nav>
    
    <main role="main">
      <p>This will be the main content area.</p>
      <p>It will render data relevant to:</p>
      <p>userType: ${userType}</p>
      <p>profId: ${profId} (undefined is OK)</p>
      <p>userId: ${userId}</p>
      <p>Based on the above, you'd see the <u>${viewType}</u> view.</p>
      <hr/>
    </main>
  `;
    
    return viewHTML;
  
}

function portalBuildSelector(profType, profId) {

  // If the profId is undefined, go to create mode.
  const viewType = profId ? 'Static' : 'Create'; 

  // Create the viewType string  
  const buildType = profType + '-' + viewType;

  return buildType;  
  
}


module.exports = {
  buildPortal,
  portalBuildSelector
};