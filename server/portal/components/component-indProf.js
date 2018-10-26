'use strict';

const { IndProf } = require('../../api/indProf');

// INDIVIDUAL PROFILE VIEW:
//  If the active userAccount has an existing indProf, it displays the details
//    of the indProf, with an "Edit" option.
//  If the user clicks the "Edit" option, it displays the profile editing form.
//    using pre-populated data from the existing profile.
//  If the active userAccont does NOT have an existing indProf, it displays the
//    profile editing form, without any pre-populated data.


function buildComponent(userType, profId, mode) {
  // Central function that oversees how indProf data/editing is presented to
  //  the user.
  // Parameters:
  //  userType: [individual || organization]
  //    Note: 'organization' is non-MVP functionality.
  //  profId: MongoDB object ref.
  //  mode (optional): [edit || create || static]
  
  // Determine which view to present
  mode = setView(profId, mode);

  let outputHTML = `
    <p>Welcome to the Individual Profile view!</p>
    <p>userType: ${userType}</p>
    <p>profId: ${profId}</p>
  `;
  
  outputHTML += editMode();
  
  return outputHTML;
  
}

function setView(profId, mode) {
  // Determines view to use when presenting indProf data to the user.
  // Parameters:
  //  indProf: MongoDB indProf object ref
  //  mode: Optional [edit || create || static]
  //    If defined, returned. If undefined, function determines it.
  
  // Validate acceptable view modes
  const viewModes = ['edit', 'create', 'static', undefined];
  if (!viewModes.includes(mode)) {
    throw('Invalid view mode passed to indProf.setView()');
  }
  
  if (!profId) {
    mode = 'create';
  }
  
  if (profId && !mode) {
    mode = 'static';
  }
  
  return mode;
  
}

function editMode() {
  // Renders an HTML form for editing an indProf object. Pre-populates the form
  //  with existing indProf data.
  // indProf fields:
  //  firstName: String, required
  //  lastName: String, required
  //  email: String, required
  //  phone: String
  //  linekdIn: String

  const outputHTML = `
    <form>
      <fieldset>
        <legend>Your profile</legend>
        <label for="firstname">First name:
          <input type="text" name="firstname" required>
        </label>
        <label for="lastname">Last name:
          <input type="text" name="lastname" required>
        </label>
        <label for="email">Email address:
          <input type="email" name="email" required>
        </label>
        <label for="phone">Phone number:
          <input type="text" name="phone">
        </label>
        <label for="linkedin">LinkedIn profile:
          <input type="url" name="linkedin">
        </label>
        <input type="submit" class="js-indprof-submit" value="Submit">
      </fieldset>
    </form>
  `;
  
  return outputHTML;
  
}


module.exports = {
  buildComponent,
  setView,
  editMode
};