'use strict';

// This file contains the user interaction controls for Portal view, which 
//  loads once the user has authenticated.



/* ==============
   = MENU ITEMS =
   ============== */
  
// Handle click on tabNavMenu: Profile link

$('html').on('click', '.js-tabnavmenu-profile', e =>
  loadIndProf(e, localStorage.JWT, updateMain, handleAjaxError));

  function loadIndProf(event, authToken, onSuccess, onError) {
    // Make an API call to /portal/components/indprof; handle result.

    event.preventDefault();
    
    // Extract data from event, prepare to pass to GET request
    const data = {
      userType: event.currentTarget.dataset.usertype,
      profId: event.currentTarget.dataset.profid,
      mode: event.currentTarget.dataset.mode
    };
    
    // Create authentication headers
    const headersObj = {
      Authorization: `Bearer ${authToken}`,
      contentType: 'application/json'
    };

    const reqUrl = `/portal/components/indprof`;
    
    let request = $.ajax({
      url: reqUrl,
      type: 'GET',
      headers: headersObj,
      data: data,
      success: onSuccess,
      error: onError
    });
    
  }

// Handle click on tabNavMenu: Positions link
$('html').on('click', '.js-tabnavmenu-positions', e =>
  loadPositions(e, localStorage.JWT, updateMain, handleAjaxError));
  
  function loadPositions(event, authToken, onSuccess, onError) {
    // Make an API call to /portal/components/positions; handle results
  
    event.preventDefault();
    
    // Create authentication headers
    const headersObj = {
      Authorization: `Bearer ${authToken}`,
      contentType: 'application/json'
    };

    // Extract data from event, prepare to pass to GET request
    const data = {
      userType: event.currentTarget.dataset.usertype,
      profId: event.currentTarget.dataset.profid
    };
    
    const reqUrl = `/portal/components/positions`;
    
    $.ajax({
      url: reqUrl,
      type: 'GET',
      headers: headersObj,
      data: data,
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


    // Extract data from event, prepare to pass to GET request
    const data = {
      userType: event.currentTarget.dataset.usertype,
      profId: event.currentTarget.dataset.profid
    };
    
    const reqUrl = `/portal/components/applications`;
    
    $.ajax({
      url: reqUrl,
      type: 'GET',
      headers: headersObj,
      data: data,
      success: onSuccess,
      error: onError
    });
    
  }

/* ================
   = FORM ACTIONS =
   ================ */

   
// Handle click on "Create individual profile" form

$('html').on('submit', '.js-indprof-create', e =>
  createIndProf(e, localStorage.JWT, moveToPortal, handleAjaxError));

  function createIndProf(event, authToken, onSuccess, onError) {
    // Create an indProf
    event.preventDefault();
    
    // Extract data from event
    const data = {
      firstName: $('input[name="firstname"]').val(),
      lastName: $('input[name="lastname"]').val(),
      email: $('input[name="email"]').val(),
      phone: $('input[name="phone"]').val(),
      linkedIn: $('input[name="linkedin"]').val(),
      userAccount: $('input[name="userid"]').val()
    };
    
    // Create authentication headers
    const headersObj = {
      Authorization: `Bearer ${authToken}`,
      contentType: 'application/json'
    };
    
    const reqUrl = "/api/indprofs";
    
    $.ajax({
      url: reqUrl,
      type: 'POST',
      headers: headersObj,
      contentType: 'application/json',
      data: JSON.stringify(data),
      dataType: 'json',
      success: onSuccess,
      error: onError
    });

  }
  
// Handle click on 'Cancel' during indProf edit mode

$('html').on('click', '.js-indprof-cancel', e => 
  cancelIndProfEdit(e, localStorage.JWT, updateMain, handleAjaxError))
  
  function cancelIndProfEdit(event, authToken, onSuccess, onError) {
    
    event.preventDefault();
    
    const requestData = {
      userAccount: event.currentTarget.dataset.userid,
      profId: event.currentTarget.dataset.profid,
      mode: 'static'
    }
    
    const reqUrl = '/portal/components/indprof';
    
    let request = $.ajax({
        url: reqUrl,
        type: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.JWT}`,
          contentType: 'application/json'
        },
        data: requestData,
        success: onSuccess,
        error: onError
      });
    
  }
  
// Handle click on "Submit" on edit indProf form.
  
$('html').on('submit', '.js-indprof-edit', e =>
  editIndProf(e, localStorage.JWT, moveToPortal, handleAjaxError));

  function editIndProf(event, authToken, onSuccess, onError) {
    // Create an indProf
    event.preventDefault();
    
    // Extract data from event
    const data = {
      firstName: $('input[name="firstname"]').val(),
      lastName: $('input[name="lastname"]').val(),
      email: $('input[name="email"]').val(),
      phone: $('input[name="phone"]').val(),
      linkedIn: $('input[name="linkedin"]').val(),
      userAccount: $('input[name="userid"]').val(),
      indProfId: $('input[name="profid"]').val()
    };
    
    // Create authentication headers
    const headersObj = {
      Authorization: `Bearer ${authToken}`,
      contentType: 'application/json'
    };
    
    const reqUrl = `/api/indprofs/${data.indProfId}`;
    
    $.ajax({
      url: reqUrl,
      type: 'PUT',
      headers: headersObj,
      contentType: 'application/json',
      data: JSON.stringify(data),
      dataType: 'json',
      success: onSuccess,
      error: onError
    });

  }
  


  

/* ===========
   = BUTTONS =
   =========== */

$('html').on('click', '.js-edit-indprof', e => 
  handleEditIndProfClick(e, localStorage.JWT, updateMain, handleAjaxError))
  
  function handleEditIndProfClick(event, authToken, onSuccess, onError) {
    
    event.preventDefault();
    
    const requestData = {
      userAccount: event.currentTarget.dataset.userId,
      profId: event.currentTarget.dataset.profid,
      mode: 'edit'
    };
    
    const reqUrl = '/portal/components/indprof';
    
    let request = $.ajax({
        url: reqUrl,
        type: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.JWT}`,
          contentType: 'application/json'
        },
        data: requestData, // For finding userAccount
        success: onSuccess,
        error: onError
      });

  }
  
  



/* ====================
   = HELPER FUNCTIONS =
   ==================== */

function updateMain(content) {
  // Update the <main> element of the Portal. Converted to a function for
  //  testability.
  
  $('main').html(content);
  
}

function handleAjaxError(err) {
  // Consistently handle how .ajax() errors are handled in a testable fashion.

  console.log(err);  
  
}


function moveToPortal(res) {

  const reqUrl = '/portal';
  
  const requestData = {
    userType: 'individual',
    userId: res.userAccount,
    profId: res._id
  }
  
  let request = $.ajax({
      url: reqUrl,
      type: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.JWT}`,
        contentType: 'application/json'
      },
      data: requestData, // For finding userAccount
      success: loadPortalSuccess,
      error: loadPortalFailure
    });
  
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
