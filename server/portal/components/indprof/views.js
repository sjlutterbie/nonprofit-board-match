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
  
  if (userData == null) {
    return 'Error finding userData in testing mode';
  }


  const outputHTML = `
    <h2>Profile</h2>
    <div class="card edit-profile-card">
    <h2>Your profile</h2>
      <form class="indprof-edit js-indprof-edit">
        <div class="fieldset-container">
          <fieldset>
            <legend>Edit profile</legend>
            <p class="required-fields">
              Fields with an asterisk (*) are required"
            </p>
            <label for="firstname">First name*
              <input type="text" name="firstname"
                     value="${userData.firstName}" required>
            </label>
            <label for="lastname">Last name*
              <input type="text" name="lastname"
                     value="${userData.lastName}" required>
            </label>
            <label for="email">Email*
              <input type="email" name="email"
                     value="${userData.email}" required>
            </label>
            <label for="phone">Phone
              <input type="text" name="phone"
                     value="${userData.phone}">
            </label>
            <label for="linkedin">LinkedIn
              <input type="url" name="linkedin"
                     placeholder="http://www.linkedin.com/in/john-doe"
                     value="${userData.linkedIn}">
            </label>
              <input type="hidden" name="profid" value="${userData._id}">
              <input type="hidden" name="userid" value="${userData.userAccount}">
            <div class="form-actions-container">
              <input type="button" class="js-indprof-cancel"
                     data-profid="${userData._id}"
                     data-userid="${userData.userAccount}"
                     value="Cancel">
              <input type="submit" class="js-indprof-submit"
                     data-profid="${userData._id}"
                     value="Submit">
            </div>
          </fieldset>
        </div>
      </form>
    </div>
    
    <div class="card profile-card">
      <h2>LinkedIn Details</h2>
      <h3 class="coming-soon">Coming soon!</h3>
    </div>
    
    <div class="card profile-card">
      <h2>Service experience</h2>
      <h3 class="coming-soon">Coming soon!</h3>
    </div>
  `;
  
  return outputHTML;
  
}

function createMode(userData) {
  // Renders an HTML form for creating an indProf object. Pre-populates the
  //  form with the associated userId, for cross-referencing
  
  let outputHTML = `
    <div class="card edit-profile-card">
      <p>Welcome to BoardMatch! First, please create your public profile, which
      will be shared with local non-profits when you apply to join their boards.
      Once you've created your profile, you will be able to browse and apply to
      board positions with local non-profits, and start giving back to your
      community.</p>
      <form class="indprof-edit js-indprof-create">
        <fieldset>
          <legend>Your profile</legend>
          <p class="required-fields">
            Fields with an asterisk (*) are required"
          </p>
          <label for="firstname">First name*
            <input type="text" name="firstname" required>
          </label>
          <label for="lastname">Last name*
            <input type="text" name="lastname" required>
          </label>
          <label for="email">Email*
            <input type="email" name="email" required>
          </label>
          <label for="phone">Phone
            <input type="text" name="phone">
          </label>
          <label for="linkedin">LinkedIn
            <input type="url" name="linkedin"
                   placeholder="http://www.linkedin.com/in/john-doe">
          </label>
          <input type="hidden" name="userid" value="${userData.userId}">
          <div class="form-actions-container indprof-create-buttons">
            <input type="submit" class="js-create-indprof-submit" value="Submit">
          </div>
        </fieldset>
      </form>
    </div>
    
    <div class="card profile-card">
      <h2>LinkedIn Details</h2>
      <h3 class="coming-soon">Coming soon!</h3>
    </div>
    
    <div class="card profile-card">
      <h2>Service experience</h2>
      <h3 class="coming-soon">Coming soon!</h3>
    </div>
  `;

  return outputHTML;
  
}

function staticMode(userData) {
  // Renders HTML presenting an indProf object. The button at the end of the
  //  view triggers a switch to editMode.
  
  if (userData == null) {
    return 'Error finding userData in testing mode';
  }
  
  
  const outputHTML = `
    <h2>Profile</h2>
    <div class="card profile-card">
      <h2>Your profile</h2>
      <div class="photo-and-name">
        <img class="profile-image"
             src="/img/default_profile.png"
             alt="Default profile image"/>
        <p>${userData.firstName} ${userData.lastName}</p>
      </div>
      
      <div class="contact-info">
        <table class="contact-info">
          <tr>
            <th scope="row">Email:</th>
            <td>
              <a href="mailto:${userData.email}" target="_blank">
                ${userData.email}
              </a>
            </td>
          </tr>
          <tr>
            <th scope="row">Phone:</th>
            <td>
              <a href="tel:${userData.phone}" target="_blank">
                ${userData.phone}
              </a>
            </td>
          </tr>
          <tr>
            <th scope="row">LinkedIn:</th>
            <td>
              <a href="${userData.linkedIn}" target="_blank"
                 title="${userData.firstName} ${userData.lastName} on LinkedIn">
                  View Profile
              </a>
            </td>
          </tr>
        </table>
      </div>
      <button class="edit-indprof js-edit-indprof" 
              data-userid="${userData.userAccount}"
              data-profid="${userData._id}">Edit profile</button>
    </div>
    
    <div class="card profile-card">
      <h2>LinkedIn details</h2>
      <h3 class="coming-soon">Coming soon!</h3>
    </div>
    
    <div class="card profile-card">
      <h2>Service experience</h2>
      <h3 class="coming-soon">Coming soon!</h3>
    </div>
  `;  
  
  return outputHTML;
  
}

////////////////////////////////////////////////////////////////////////////////

module.exports = {
  editMode,
  createMode,
  staticMode
};