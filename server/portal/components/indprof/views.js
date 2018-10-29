'use strict';


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
  editMode,
  createMode,
  staticMode
};