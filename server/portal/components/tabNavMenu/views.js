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
      <li class="js-tabnav-option tabnav-active">
        <a href="#" data-usertype="${userType}"
                    data-profid="${profId}"
                    data-userid="${userId}"
                    data-mode="static"
                    class="js-tabnavmenu-profile">Profile</a>
      </li>
      <li class="js-tabnav-option">
        <a href="#" data-usertype="${userType}"
                    data-userid="${userId}"
                    data-profid="${profId}"
                    class="js-tabnavmenu-positions">Positions</a>
      </li>
      <li class="js-tabnav-option">
        <a href="#" data-usertype="${userType}"
                    data-profid="${profId}"
                    class="js-tabnavmenu-applications">Applications</a>
      </li>
    </ul>`;
  
  return outputHTML;
  
}

module.exports = {
  buildMenu
};