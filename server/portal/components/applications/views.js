'use strict';

// Date formatting
const moment = require('moment');
const positions = require('../positions');

function staticMode(application, posId) {
  
  const outputHTML = `
    <div class="application-content">
      <h3>Cover message</h3>
      <h4>
        Submitted: ${moment(application.dateCreated).format('MMM D, YYYY')}
      </h4>
      <p>${application.coverMessage}</p>
      <button class="js-application-withdraw"
              data-appid="${application._id}"
              data-posid="${posId}">Withdraw Application</button>
      <button class="js-application-hide"
              data-posid="${posId}">Hide Application</button>
    </div>
  `;
  
  return outputHTML;
  
}

function createMode(posId, profId) {
  
  const outputHTML = `
    <div class="application-form-wrapper">
      <form class="js-application-create"
            data-posid="${posId}"
            data-profid="${profId}">
        <fieldset>
          <legend>Apply with a cover message</legend>
          <label for="covermessage">Cover message
            <input type="textarea" name="covermessage" required>
          </label>
          <input type="button" class="js-application-cancel"
                 data-posid="${posId}" value="Cancel">
          <input type="submit" class="js-application-submit"
                 data-posid="${posId}" value="Submit">
        </fieldset>
      </form>
    </div>
  `;
  
  return outputHTML;
  
}

function listMode(apps, profId) {
  
  // Use positions.view.makeStaticPosition to avoid duplicate HTML
  
  let outputHtml = '';
  
  apps.forEach(function(application) {

    outputHtml += `
      <div class="card">
        <div class="position" data-posid="${application.position._id}">
          <h2>${application.position.title}</h2>
          <h3>${application.position.orgProf.name}</h3>
          <h4>
            Date created: ${moment(application.position.dateCreated)
                                              .format('MMM D, YYYY')}
          </h4>
          <p>${application.position.description}</p>
          <div class="application-container">
            <div class="application-view"></div>
            <div class="application-view-controls">
              <button class="js-position-app-handler viewapp"
                      data-appid="${application._id}"
                      data-posid="${application.position._id}"
                      data-profid="${profId}">View Application</button>
            </div>
          </div>
        </div>
      </div>
    `;

  });

  return outputHtml;
  
}

////////////////////////////////////////////////////////////////////////////////

module.exports = {
  staticMode, createMode, listMode
};