'use strict';

// This file contains the user interaction controls for Portal view, which 
//  loads once the user has authenticated.




// Handle click on tabNavMenu: Profile link

$('.js-tabnavmenu-profile').click(e =>
  loadIndProf(e, localStorage.JWT, updateMain, handleAjaxError));

  function loadIndProf(event, authToken, onSuccess, onError) {
    // Make an API call to /portal/components/indprof/:id; handle result.

    event.preventDefault();
    
    // Create authentication headers
    const headersObj = {
      Authorization: `Bearer ${authToken}`,
      contentType: 'application/json'
    };

    const id = 'foo'; // HARD-CODED FROM DEV PURPOSES
    const reqUrl = `/portal/components/indprof/${id}`;
    
    $.ajax({
      url: reqUrl,
      type: 'GET',
      headers: headersObj,
      success: onSuccess,
      error: onError
    });
    
  }

// Handle click on tabNavMenu: Positions link
$('.js-tabnavmenu-positions').click(e =>
  loadPositions(e, localStorage.JWT, updateMain, handleAjaxError));
  
  function loadPositions(event, authToken, onSuccess, onError) {
    // Make an API call to /portal/components/positions; handle results
  
    event.preventDefault();
    
    // Create authentication headers
    const headersObj = {
      Authorization: `Bearer ${authToken}`,
      contentType: 'application/json'
    };

    
    const reqUrl = `/portal/components/positions`;
    
    $.ajax({
      url: reqUrl,
      type: 'GET',
      headers: headersObj,
      success: onSuccess,
      error: onError
    });
    
  }

// Handle click on tabNavMenu: Positions link
$('.js-tabnavmenu-applications').click(e =>
  loadApplications(e, localStorage.JWT, updateMain, handleAjaxError));
  
  function loadApplications(event, authToken, onSuccess, onError) {
    // Make an API call to /portal/components/positions; handle results
  
    event.preventDefault();
    
    // Create authentication headers
    const headersObj = {
      Authorization: `Bearer ${authToken}`,
      contentType: 'application/json'
    };

    
    const reqUrl = `/portal/components/applications`;
    
    $.ajax({
      url: reqUrl,
      type: 'GET',
      headers: headersObj,
      success: onSuccess,
      error: onError
    });
    
  }







// Helper functions

function updateMain(content) {
  // Update the <main> element of the Portal. Converted to a function for
  //  testability.
  
  $('main').html(content);
  
}

function handleAjaxError(err) {
  // Consistently handle how .ajax() errors are handled in a testable fashion.

  console.log(err);  
  
}



// Make available as module for testing

try {
  module.exports = {
    loadIndProf,
    updateMain,
    handleAjaxError
  };
}
catch(error) {
}
