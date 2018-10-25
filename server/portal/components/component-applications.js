'use strict';

// INDIVIDUAL PROFILE VIEW:
//  If the active userAccount has an existing indProf, it displays the details
//    of the indProf, with an "Edit" option.
//  If the user clicks the "Edit" option, it displays the profile editing form.
//    using pre-populated data from the existing profile.
//  If the active userAccont does NOT have an existing indProf, it displays the
//    profile editing form, without any pre-populated data.


function buildComponent(userType, profId) {
  
  const outputHTML = `
    <p>Welcome to the Applications view!</p>
    <p>userType: ${userType}</p>
    <p>profId: ${profId}</p>
  `;
  
  return outputHTML;
  
}


module.exports = {
  buildComponent
};