'use strict';

// The tabNav menu is a horizontal menu beneath the header and above the main
//  content area. It consists of three elements (HTML: unordered list). When
//  accessing the portal as an individual user, the three options are:
//  - Profile (-> indProf-view)
//  - Open Positions (-> openPositions-view)
//  - Application (-> applications-view)


function buildComponent() {

  const outputHTML = `
    <ul>
      <li>
        <a href="#">Profile</a>
      </li>
      <li>
        <a href="#">Open Positions</a>
      </li>
      <li>
        <a href="#">Applications</a>
      </li>
    </ul>`;
  
  return outputHTML;
  
}




module.exports = {
  buildComponent
};