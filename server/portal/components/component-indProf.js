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

  // DEV OVERRIDE
  profId = "5bd3366dfb6fc074abb05a87";
  mode = 'create';

  let outputHTML = '';

  // Edit mode (DEV: Will be added to switch statement
  switch (mode) {
    case 'static':
      IndProf.findById(profId).then(staticMode);
      break;
    case 'edit':
      IndProf.findById(profId).then(function(userData) {
        outputHTML = 'Hello, world!'; // editMode(userData);
        return outputHTML;
      }
        );
      break;
    case 'create':
      const userData = {
        firstName: ' ',
        lastName: ' ',
        email: ' ',
        phone: ' ',
        linkedIn: ' '
      };
      outputHTML = createMode(userData);
      return outputHTML;
  }


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
  
  if (profId && !mode) {
    mode = 'static';
  }

  if (!profId) {
    mode = 'create';
  }


  return mode;
  
}


function editMode(userData) {
  // Renders an HTML form for editing an indProf object. Pre-populates the form
  //  with existing userData (indProf instance) data.
  // userData fields:
  //  firstName: String, required
  //  lastName: String, required
  //  email: String, required
  //  phone: String
  //  linkedIn: String
  
  const outputHTML = `
    <form>
      <fieldset>
        <legend>Your profile</legend>
        <label for="firstname">First name:
          <input type="text" name="firstname"
                 value="${userData.firstName}" required>
        </label>
        <label for="lastname">Last name:
          <input type="text" name="lastname"
                 value="${userData.lastName}" required>
        </label>
        <label for="email">Email address:
          <input type="email" name="email"
                 value="${userData.email}" required>
        </label>
        <label for="phone">Phone number:
          <input type="text" name="phone"
                 value="${userData.phone}">
        </label>
        <label for="linkedin">LinkedIn profile:
          <input type="url" name="linkedin"
                 value="${userData.linkedIn}">
        </label>
        <input type="submit" class="js-indprof-submit" value="Submit">
      </fieldset>
    </form>
  `;
  
  return outputHTML;
  
}

function createMode(userData) {
  
  let outputHTML = `
    <p>This is an HTML snippet (editable in component-indProf.js) that will
       welcome a new user to the system, and instruct them to create their
       individual profile to get started.</p>
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

function staticMode(userData) {
  
  const outputHTML = `
    <h2>Your profile</h2>
    <ul>
      <li>First name: ${userData.firstName}</li>
      <li>Last name: ${userData.lastName}</li>
      <li>Email: ${userData.email}</li>
      <li>Phone: ${userData.phone}</li>
      <li>LinkedIn: ${userData.linkedIn}</li>
    </ul>
    <button>Edit profile (inactive)</button>
  `;  
  
  return outputHTML;
  
}


module.exports = {
  buildComponent,
  setView,
  editMode,
  createMode,
  staticMode
};