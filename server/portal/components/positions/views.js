'use strict';

function staticMode(positions, profId) {
  // Build a list of open positions.
  // For each open position, insert the data into an HTML template string
  
  let outputHtml = '';
  
  positions.forEach(function(position) {
    outputHtml += makeStaticPosition(position, profId);
  });
  
  return outputHtml;
  
}

  function makeStaticPosition(position, profId) {
    
    const outputHtml = `
      <div class="card">
        <div class="position" data-posid="${position._id}">
          <h2>${position.title}</h2>
          <h3>${position.orgProf.name}</h3>
          <p>${position.description}</p>
          <div class="application-container">
            <div class="application-view"></div>
            <div class="application-view-controls">
              <button class="js-position-app-handler apply"
                      data-posid="${position._id}"
                      data-profid="${profId}">Apply</button>
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