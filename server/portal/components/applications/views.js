'use strict';

// Date formatting
const moment = require('moment');
const positions = require('../positions');

function staticMode(application, posId) {
  
  const outputHTML = `
    <div class="application-content">
      <h2>Your application</h2>
      <h3>
        <span class="label">Submitted:</span> ${moment(application.dateCreated).format('MMM D, YYYY')}
      </h3>
      <div class="static-covermessage">${application.coverMessage}</div>
      <div class="form-actions-container">
        <button class="button-secondary js-application-withdraw"
                data-appid="${application._id}"
                data-posid="${posId}">Withdraw</button>
        <button class="button-primary js-application-hide"
                data-posid="${posId}">Hide</button>
      </div>
    </div>
  `;
  
  return outputHTML;
  
}

function createMode(posId, profId) {
  
  const outputHTML = `
    <div class="application-content application-form-wrapper">
      <form class="js-application-create" name="app-form-${posId}"
            data-posid="${posId}"
            data-profid="${profId}">
        <div class="fieldset-container">
          <fieldset>
            <div class="fieldset-contents">
              <legend>Apply with a cover message</legend>
              <label for="covermessage">Cover message
                <textarea form="app-form-${posId}" rows="5" wrap="soft"
                       name="covermessage" 
                       placeholder="Use this space to write a brief message to accompany your profile. Upon submission, this message and your profile will be sent to the non-profit, for their consideration." required></textarea>
              </label>
              <div class="form-actions-container">
                <input type="button" class="button-secondary js-application-cancel"
                       data-posid="${posId}" value="Cancel">
                <input type="submit" class="button-primary js-application-submit"
                       data-posid="${posId}" value="Submit">
              </div>
            </div>
          </fieldset>
        </div>
      </form>
    </div>
  `;
  
  return outputHTML;
  
}

function listMode(apps, profId) {
  
  // Use positions.view.makeStaticPosition to avoid duplicate HTML
  
  let outputHtml = '';
  
  if (apps.length === 0) {
    
    // "No applications" message
    
    outputHtml = `
      <h2>Applications</h2>
      <div class="card no-items">
        <h2>You haven't submitted any applications, yet.</h2>
        <h3>Click the 'Positions' tab to view open positions.</h3>
      </div>
    `;
    
  } else {
    
    apps.forEach(function(application) {
  
      outputHtml += `
        <h2>Applications</h2>
        <div class="card">
          <div class="position" data-posid="${application.position._id}">
            <h2>${application.position.title}</h2>
            <h3>
              <a href="${application.position.orgProf.website}"
                 title="${application.position.orgProf.name}" target="_blank">
                ${application.position.orgProf.name}
              </a>
            </h3>
            <h4>
              <span class="label">Submitted:</span>&nbsp;
                ${moment(application.position.dateCreated)
                .format('MMM D, YYYY')}
            </h4>
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
  }

  return outputHtml;
  
}

////////////////////////////////////////////////////////////////////////////////

module.exports = {
  staticMode, createMode, listMode
};