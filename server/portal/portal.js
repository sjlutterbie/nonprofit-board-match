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
        <a href="#" class="header-dropdown-icon js-header-dropdown-icon">
          <i class="material-icons header-dropdown-icon">
            <span class="reader-only">Settings menu</span>
            menu
          </i>
        </a>
        <ul class="header-dropdown js-header-dropdown">
          <li class="contact-link">
            <a href="mailto:simon@ltrbe.com"
               target="_blank">Contact</a></li>
          <li class="logout-link">
            <a href="#" class="js-log-out">Log out</a>
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