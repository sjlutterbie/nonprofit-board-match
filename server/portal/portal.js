'use strict';

/*
  Build the overall interface for the portal view. Currently defaults to the
    individual profile view. 
*/

const tabNavMenu = require('./components/tabNavMenu');
const indProf = require('./components/indprof');

function buildPortal(userType, profId, userId, profile) {
  
  const outputHtml = `
    <header>
      <h1>Board Match Portal</h1>
      <nav class="header-nav js-header-nav">
        <ul>
          <li>
            <a href="#">Contact</a></li>
          <li>
            <a href="#">Log out</a>
          </li>
        </li>
      </nav>
    </header>
    
    <nav class="tab-nav">
      ${tabNavMenu.buildMenu(userType, userId, profId)}
    </nav>
    
    <main role="main">
      ${indProf.staticMode(profile)}
    </main>
  `;
  
  return outputHtml;
}


module.exports = {
  buildPortal
};