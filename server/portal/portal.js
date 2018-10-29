'use strict';

const tabNavMenu = require('./components/component-tabNavMenu');
const indProf = require('./components/indprof');

function buildPortal(userType, profId, userId, viewType) {
  
  const outputHtml = `
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
    </main>
  `;
  
  return outputHtml;
}


module.exports = {
  buildPortal
};