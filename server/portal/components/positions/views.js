'use strict';

// Date formatting
const moment = require('moment');

const { hasIndProfApplied } = require('./controllers');

function staticMode(positions, profId) {
  // Build a list of open positions.
  // For each open position, insert the data into an HTML template string
  
  let outputHtml = '<h2>Positions</h2>';
  
  if (positions.length === 0) {
    
    outputHtml += `
      <div class="card no-items">
        <h2>There are currently no open positions.</h2>
        <h3>Please check back again, soon!</h3>
      </div>
    `;
    
  } else {
    
    positions.forEach(function(position) {
      outputHtml += makeStaticPosition(position, profId);
    });
  }
  
  return outputHtml;
  
}

  function makeStaticPosition(position, profId) {
    

    let buttonText = 'Apply';
    let buttonClass = 'apply'
    let buttonData = '';

    let targetApp;
    // Check if a relevant application exists
    try {
      targetApp = hasIndProfApplied(position, profId);
    }
    catch(error) {
      // Bypasses http connectivity requirement for unit testing
    }
      
    
    // If an application exists...
    if (targetApp) {
      // ... update the Application button 
      buttonText = 'View Application';
      buttonClass = 'viewapp';
      buttonData = `data-appid="${targetApp._id}"`;
    }  

  
    const outputHtml = `
      <div class="card position-card">
        <div class="position" data-posid="${position._id}">
          <h2>${position.title}</h2>
          <h3>
            <a href="${position.orgProf.website}"
               title="${position.orgProf.name}" target="_blank">
              ${position.orgProf.name}
            </a>
          </h3>
          <h4>
            <span class="label">Date created:</span> ${moment(position.dateCreated).format('MMM D, YYYY')}
          </h4>
          <p>${position.description}</p>
          <div class="application-container">
            <div class="application-view"></div>
            <div class="application-view-controls">
              <button class="js-position-app-handler ${buttonClass}"
                      ${buttonData}
                      data-posid="${position._id}"
                      data-profid="${profId}">${buttonText}</button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    return outputHtml;
    
  }


module.exports = {
  staticMode,
  makeStaticPosition
};