'use strict';

// The tabNav menu is a horizontal menu beneath the header and above the main
//  content area. It consists of three elements (HTML: unordered list). When
//  accessing the portal as an individual user, the three options are:
//  - Profile (-> indProf-view)
//  - Open Positions (-> openPositions-view)
//  - Application (-> applications-view)


function buildMenu(userType, userId, profId) {

  const outputHTML = `
    <ul>
      <li class="js-tabnav-option js-tabnavmenu-profile tabnav-active"
          data-usertype="${userType}"
                    data-profid="${profId}"
                    data-userid="${userId}"
                    data-mode="static">Profile</li>
      <li class="js-tabnav-option js-tabnavmenu-positions"
          data-usertype="${userType}"
                    data-userid="${userId}"
                    data-profid="${profId}">Positions</li>
      <li class="js-tabnav-option js-tabnavmenu-applications"
          data-usertype="${userType}"
          data-profid="${profId}">Applications</li>
    </ul>`;
  
  return outputHTML;
  
}

module.exports = {
  buildMenu
};