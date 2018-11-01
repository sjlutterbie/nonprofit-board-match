'use strict';

function staticMode(positions) {
  // Build a list of open positions.
  // For each open position, insert the data into an HTML template string
  
  let outputHtml = '';
  
  positions.forEach(function(position) {
    outputHtml += makeStaticPosition(position);
  });
  
  return outputHtml;
  
}

  function makeStaticPosition(position) {
    
    const outputHtml = `
      <div class="position card">
        <h2>${position.title}</h2>
        <h3>${position.orgProf.name}</h3>
        <p>${position.description}</p>
        <div class="application-container">
          <div class="application-view"></div>
          <div class="application-view-controls"></div>
        </div>
      </div>
    `;
    
    return outputHtml;
    
  }


module.exports = {
  staticMode,
  makeStaticPosition
};