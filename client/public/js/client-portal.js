'use strict';

/*
Handles user interactions within the Portal, which loads once the user has 
  authenticated, and created an individual profile.
*/

/* ==============
   = MENU ITEMS =
   ============== */
  
// Handle click on tabNavMenu: Profile link
$('html').on('click', '.js-tabnavmenu-profile', function(e) {
  e.preventDefault();

  // Execute request a promise
  loadIndProf(e, localStorage.JWT)
    .then(updateMain)
    .catch(handleError);

});  

  function loadIndProf(event, authToken) {
    // Make an API call to /portal/components/indprof; return as promise

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
    
    let promObj = new Promise(function(resolve, reject) {
      
      $.ajax({
        url: reqUrl,
        type: 'GET',
        headers: headersObj,
        data: data,
        success: resolve,
        error: reject
      });
      
    });
    
    return promObj;
  }

// Handle click on tabNavMenu: Positions link
$('html').on('click', '.js-tabnavmenu-positions', function(e) {
  e.preventDefault();
  
  // Execute request as promise
  loadPositions(e, localStorage.JWT)
    .then(updateMain)
    .catch(handleError);
  
});


  function loadPositions(event, authToken) {
    // Make an API call to /portal/components/positions; return as promise
  
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
  
    let promObj = new Promise(function(resolve, reject) {
      
      $.ajax({
        url: reqUrl,
        type: 'GET',
        headers: headersObj,
        data: data,
        success: resolve,
        error: reject
      });
      
    });
    
    return promObj;

  }

// Handle click on tabNavMenu: Positions link
$('html').on('click', '.js-tabnavmenu-applications', function(e) {
  e.preventDefault();
  
  // Execute request as promise
  loadApplications(event, localStorage.JWT)
    .then(updateMain)
    .catch(handleError);
  
});
  
  function loadApplications(event, authToken) {
    // Make an API call to /portal/components/positions; return as promise
  
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
    
    let promObj = new Promise(function(resolve, reject) {
      
      $.ajax({
        url: reqUrl,
        type: 'GET',
        headers: headersObj,
        data: data,
        success: resolve,
        error: reject
      });
    
    });
    
    return promObj;

  }

/* ================
   = FORM ACTIONS =
   ================ */

   
// Handle click on "Create individual profile" form

$('html').on('submit', '.js-indprof-create', function(e) {
  e.preventDefault();
  
  // Execute request as a promise
  createIndProf(localStorage.JWT)
    .then(moveToPortal)
    .then(loadPortalSuccess)
    .catch(handleError);
  
});

  function createIndProf(authToken) {
    // Create an indProf

    // Extract data from form
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
    
    let promObj = new Promise(function(resolve, reject) {
    
      $.ajax({
        url: reqUrl,
        type: 'POST',
        headers: headersObj,
        contentType: 'application/json',
        data: JSON.stringify(data),
        dataType: 'json',
        success: resolve,
        error: reject
      });
    });
    
    return promObj;
  }
  
// Handle click on 'Cancel' during indProf edit mode
$('html').on('click', '.js-indprof-cancel', function(e) {
  e.preventDefault();  
  
  // Execute request as promise
  cancelIndProfEdit(e, localStorage.JWT)
    .then(updateMain)
    .catch(handleError);
  
});

  function cancelIndProfEdit(event, authToken) {
    
    const requestData = {
      userAccount: event.currentTarget.dataset.userid,
      profId: event.currentTarget.dataset.profid,
      mode: 'static'
    };
    
    const reqUrl = '/portal/components/indprof';
    
    let promObj = new Promise(function(resolve, reject) {
      
      $.ajax({
        url: reqUrl,
        type: 'GET',
        headers: {
          Authorization: `Bearer ${authToken}`,
          contentType: 'application/json'
        },
        data: requestData,
        success: resolve,
        error: reject
      });
    });
    
    return promObj;
  }
  
// Handle click on "Submit" on edit indProf form.
  
$('html').on('submit', '.js-indprof-edit', function(e) {
  e.preventDefault();
  
  // Execute request as promise
  editIndProf(localStorage.JWT)
    .then(moveToPortal) // Also a promise function
    .then(loadPortalSuccess)
    .catch(handleError);
  
});

  function editIndProf(authToken) {
    // Create an indProf

    // Extract data from form
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
    
    let promObj = new Promise(function(resolve, reject) {
      
      $.ajax({
        url: reqUrl,
        type: 'PUT',
        headers: headersObj,
        contentType: 'application/json',
        data: JSON.stringify(data),
        dataType: 'json',
        success: resolve,
        error: reject
      });
    });
    
    return promObj;
  }

/* ===========
   = BUTTONS =
   =========== */

$('html').on('click', '.js-edit-indprof', function(e) {
  e.preventDefault();
  
  // Execute request as promise
  handleEditIndProfClick(e, localStorage.JWT)
    .then(updateMain)
    .catch(handleError);
  
});

  function handleEditIndProfClick(event, authToken) {
    
    const requestData = {
      userAccount: event.currentTarget.dataset.userId,
      profId: event.currentTarget.dataset.profid,
      mode: 'edit'
    };
    
    const reqUrl = '/portal/components/indprof';
    
    let promObj = new Promise(function(resolve, reject) {
    
      $.ajax({
        url: reqUrl,
        type: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.JWT}`,
          contentType: 'application/json'
        },
        data: requestData,
        success: resolve,
        error: reject
      });
    });
    
    return promObj;
  }

/* ====================
   = HELPER FUNCTIONS =
   ==================== */

function updateMain(content) {
  // Update the <main> element of the Portal. Converted to a function for
  //  testability.
  
  $('main').html(content);
  
}

function handleError(err) {
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
  
  let promObj = new Promise(function(resolve, reject) {
  
    $.ajax({
      url: reqUrl,
      type: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.JWT}`,
        contentType: 'application/json'
      },
      data: requestData, // For finding userAccount
      success: resolve,
      error: reject
    });
  });

  return promObj;  
}
  
  function loadPortalSuccess(res) {
    // Clears login/createAccount form, replaces with
    //  portal/createProfile content.
    
    // Replace HTML
    $('.content-wrapper').html(res);

    // Update CSS
    $('.content-wrapper').removeClass('login-wrapper');

    // For testing purposes
    return res;
    
  }


// Make available as module for testing

try {
  module.exports = {
    loadIndProf,
    loadPositions,
    loadApplications,
    createIndProf,
    cancelIndProfEdit,
    editIndProf,
    handleEditIndProfClick,
    updateMain,
    handleError,
    moveToPortal,
    loadPortalSuccess
  };
}
catch(error) {
}
