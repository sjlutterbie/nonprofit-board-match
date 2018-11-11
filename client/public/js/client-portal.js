'use strict';

/*
Handles user interactions within the Portal, which loads once the user has 
  authenticated, and has created an individual profile.
*/

/* ==============
   = MENU ITEMS =
   ============== */
  
// Handle click on log out button
$('html').on('click', '.js-log-out', function(e) {
  e.preventDefault();
  
  // Clear JWT
  localStorage.setItem('JWT', '');
  
  // Re-direct to login page
  window.location.href="/";
  
});
  
  
// Handle click on header-nav dropdown icon

$('html').on('click', '.js-header-dropdown-icon', function(e) {
  e.preventDefault();
  
  $('.js-header-dropdown').toggleClass('responsive-dropdown');
  
});

// Handle highlighting active tabNav menu item

$('html').on('click', '.js-tabnav-option', function(e) {
  e.preventDefault();
  
  $('.js-tabnav-option').removeClass('tabnav-active');
  $(e.currentTarget).addClass('tabnav-active');
  
});
  
// Handle click on tabNavMenu: Profile link

$('html').on('click', '.js-tabnavmenu-profile', function(e) {
  e.preventDefault();

  // Execute request (promise for async handling)
  loadIndProf(e, localStorage.JWT)
    .then(updateMain)
    .catch(handleError);

});  

  function loadIndProf(event, authToken) {
    // Load Individual Profile View via GET call to /portal/components/indprof

    // Extract data from event, prepare to pass to GET request
    const data = {
      userType: event.currentTarget.dataset.usertype,
      userId: event.currentTarget.dataset.userid,
      profId: event.currentTarget.dataset.profid,
      mode: event.currentTarget.dataset.mode
    };
    
    // Create authentication headers
    const headersObj = {
      Authorization: `Bearer ${authToken}`,
      contentType: 'application/json'
    };

    const reqUrl = `/portal/components/indprof`;
    
    // Create async request as Promise object    
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
    
    // Return promise object
    return promObj;
  }

// Handle click on tabNavMenu: Positions link

$('html').on('click', '.js-tabnavmenu-positions', function(e) {
  e.preventDefault();
  
  // Execute request (promise for async handling)
  loadPositions(e, localStorage.JWT)
    .then(updateMain)
    .catch(handleError);
  
});


  function loadPositions(event, authToken) {
    // Load Positions View via GET call to /portal/components/positions

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
    
    // Create async request as Promise object  
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
    
    // Return promise object
    return promObj;

  }

// Handle click on tabNavMenu: Applications link

$('html').on('click', '.js-tabnavmenu-applications', function(e) {
  e.preventDefault();
  
  // Execute request (promise for async handling)
  loadApplications(e, localStorage.JWT)
    .then(updateMain)
    .catch(handleError);
  
});
  
  function loadApplications(event, authToken) {
    // Load Applications view via GET call to /portal/components/applications/apps/:id
  
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
    
    const reqUrl = `/portal/components/applications/apps/${data.profId}`;

    // Create async request as Promise object
    let promObj = new Promise(function(resolve, reject) {
      
      $.ajax({
        url: reqUrl,
        type: 'GET',
        headers: headersObj,
        success: resolve,
        error: reject
      });
    
    });
    
    // Return promise object
    return promObj;

  }

/* ================
   = FORM ACTIONS =
   ================ */

   
// Handle click on "Create individual profile" form

$('html').on('submit', '.js-indprof-create', function(e) {
  e.preventDefault();
  
  // Execute request (promise for async handling)
  createIndProf(localStorage.JWT)
    .then(moveToPortal)
    .then(loadPortalSuccess)
    .catch(handleError);
  
});

  function createIndProf(authToken) {
    // Create an indProf via POST call to /api/indprofs

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
    
    // Create async request as Promise object
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
    
    // Return promise object
    return promObj;
  }
  
// Handle click on 'Cancel' during indProf edit mode
$('html').on('click', '.js-indprof-cancel', function(e) {
  e.preventDefault();  
  
  // Execute request (promise for async handling)
  cancelIndProfEdit(e, localStorage.JWT)
    .then(updateMain)
    .catch(handleError);
  
});

  function cancelIndProfEdit(event, authToken) {
    // Cancel editing, return to static view
    
    // Extract data from current event
    const requestData = {
      userId: event.currentTarget.dataset.userid,
      profId: event.currentTarget.dataset.profid,
      mode: 'static'
    };
    
    const reqUrl = '/portal/components/indprof';
    
    // Create async request as Promise object
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
    
    // Return promise object
    return promObj;
  }
  
// Handle click on "Submit" on edit indProf form.
$('html').on('submit', '.js-indprof-edit', function(e) {
  e.preventDefault();
  
  // Execute request (promise for asynch handling)
  editIndProf(localStorage.JWT)
    .then(moveToPortal) // Also a promise function
    .then(loadPortalSuccess)
    .catch(handleError);
  
});

  function editIndProf(authToken) {
    // Edit an existing individual profile via PUT call to /api/indprofs/:id

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
    
    // Create async request as Promise object
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
    
    // Return promise object
    return promObj;
  }
  
// Handle click 'Cancel' on Application form
$('html').on('click', '.js-application-cancel', function(e){
  e.preventDefault();
  
  // Extract posId
  const posId = e.currentTarget.dataset.posid;
  
  // Clear the form
  $(`div[data-posid="${posId}"]`)
    .find('.application-view').html('');
  
  // Reset the DOM  
  toggleApplicationButton(posId);

});

// Handle Application form submission
$('html').on('submit', '.js-application-create', function(e){
  e.preventDefault();
  
  // Collect information from current event
  const posId = e.currentTarget.dataset.posid;
  const profId = e.currentTarget.dataset.profid;
  
  // Convert linebreaks to HTML
  const coverMessage = 
    $(`form[data-posid="${posId}"] textarea[name="covermessage"]`)
      .val().replace(/\n/g, "<br />");

  
  // Compile form data
  const formData = {
    coverMessage: coverMessage,
    applicationDate: new Date(),
    position: posId,
    indProf: profId
  };

  // Execute request (promise for async)
  submitApplication(formData, localStorage.JWT)
    .then(function(res) {
      const appId = res._id;
      handlePosViewAppClick(res._id, posId,localStorage.JWT) // Returns promise
        .then(res => {
          updatePosAppView(res, posId);
          // Update class of 'View app' button
          updateAppViewApplyButton(
            posId, 'View Application', 'viewapp', appId
          );
        })
        .catch(handleError);
    })
    .catch(handleError);
    
});

  function submitApplication(formData, authToken) {
    // Submit application via POST call to /api/applications
    
    const reqUrl = '/api/applications';
    
    // Create async request as promise object
    const promObj = new Promise(function(resolve, reject){
      
      $.ajax({
        url: reqUrl,
        type: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
          contentType: 'application/json'
        },
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: resolve,
        error: reject
      });

    });

    // Return promise object
    return promObj;
    
  }


/* ===========
   = BUTTONS =
   =========== */

// Handle click on 'Edit profile' button
$('html').on('click', '.js-edit-indprof', function(e) {
  e.preventDefault();
  
  // Execute request (promise for async)
  handleEditIndProfClick(e, localStorage.JWT)
    .then(updateMain)
    .catch(handleError);
  
});

  function handleEditIndProfClick(event, authToken) {
    // Switch from individual profile "staticMode" to "editMode" 
    
    // Collect data from current event
    const requestData = {
      userId: event.currentTarget.dataset.userid,
      profId: event.currentTarget.dataset.profid,
      mode: 'edit'
    };
    
    const reqUrl = '/portal/components/indprof';
    
    // Create async request as promise object
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
    
    // Return promise object
    return promObj;
  }
  
// Handle Application display toggle button on Position cards
$('html').on('click', '.js-position-app-handler', function(e) {
  e.preventDefault();
  
  // Collect data from current event
  const posId = e.currentTarget.dataset.posid;
  const profId = e.currentTarget.dataset.profid;
  
  // Determine which view to render
  const view = determineAppButtonAction(e.currentTarget);
  
  if (view === 'apply') {
    // Application submission form
    
    // Execute request (promise for async)
    handlePosApplyClick(posId, profId, localStorage.JWT)
      .then(res => {
        updatePosAppView(res, posId);
        toggleApplicationButton(posId);
      })
      .catch(handleError);
  }
  
  if (view === 'viewapp') {
    // Static application view
    const appId = e.currentTarget.dataset.appid;
    
    // Execute request (promise for async)
    handlePosViewAppClick(appId, posId, localStorage.JWT)
      .then(res => {
        updatePosAppView(res, posId);
        toggleApplicationButton(posId);
      })
      .catch(handleError);
  }

});

  function handlePosApplyClick(posId, profId, authToken) {
    // Load Application form via GET call to
    //  /portal/components/applications/apply

    // Identify position ID clicked.
    const requestData = {
     posId: posId, 
     profId: profId
    };
    
    const reqUrl = '/portal/components/applications/apply';
    
    // Create async request as promise object
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
    
    // Return promise object
    return promObj;
    
  }
  
  function handlePosViewAppClick(appId, posId, authToken) {
    // Load Application static view via GET call to
    //  /portal/components/applications/viewapp/:id
    
    const reqUrl = `/portal/components/applications/viewapp/${appId}`;
    
    const requestData = {
      posId: posId
    };
    
    // Create async request as promise object
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
    
    // Return promise object
    return promObj;
    
  }

// 'Hide Application' in Application view on Position Cards
$('html').on('click', '.js-application-hide', function(e) {
  e.preventDefault();
  
  
  // Clear the application view
  $('.application-view').html('');
  
  // Toggle the "View Application" button
   toggleApplicationButton(e.currentTarget.dataset.posid);
  
  
});

// "Withdraw Application" in Application view on Position Cards
$('html').on('click', '.js-application-withdraw', function(e) {
  e.preventDefault();
  
  const appId = e.currentTarget.dataset.appid;
  const posId = e.currentTarget.dataset.posid;
  
  // Confirm intent to delete. Otherwise, exit function.
  let conf = confirm('Are you sure you want to withdraw this application?');
  if(!conf) { return; }
  
  // Execute request (promise for async)
  deleteApplication(appId, localStorage.JWT)
    .then(function(res) {
      // Clear application view
      $(`.position[data-posid="${posId}"]`).find('.application-content')
        .html('').toggle();
      // Update Apply button
      updateAppViewApplyButton(posId,'Apply', 'apply', '');
      // Toggle button
      toggleApplicationButton(posId);
    })
    .catch(handleError);
  
});

  function deleteApplication(appId, authToken) {
    // Remove Application via DELETE call to /api/applications/:id
    
    const reqUrl = `/api/applications/${appId}`;
    
    // Create async request as promise object
    let promObj = new Promise(function(resolve, reject) {
      
      $.ajax({
        url: reqUrl,
        type: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`,
          contentType: 'application/json'
        },
        success: resolve,
        error: reject
      });

    });
    
    // Return promise object
    return promObj;
    
  }

/* ====================
   = HELPER FUNCTIONS =
   ==================== */

function updateMain(content) {
  
  $('main').html(content);
  
}

function updatePosAppView(content, posId) {
  
  $(`div[data-posid="${posId}"]`)
    .find('.application-view')
    .html(content);
  
}

function toggleApplicationButton(posId) {
  
  $(`button.js-position-app-handler[data-posid="${posId}"]`).toggle();
  
}

function determineAppButtonAction(button) {
  // Determines which API call to make in response to a click on the
  //  [Apply | View Application] button
  
  if($(button).hasClass('apply')) {
    return 'apply';
  }
  if($(button).hasClass('viewapp')) {
    return 'viewapp';
  }
  
}

function updateAppViewApplyButton(posId, text, cssClass, appId) {
  // Sets the text, and class of the [Apply | View Application] button
  
  $(`button.js-position-app-handler[data-posid="${posId}"]`)
    .text(text)
    // Reset CSS classes
    .removeClass('apply')
    .removeClass('viewapp')
    // Add desired class
    .addClass(cssClass)
    .attr('data-appid', appId);
    
}

function handleError(err) {
  // Consistently handle how .ajax() errors are handled in a testable fashion.

  console.log(err); 
  
}


function moveToPortal(res, authToken) {
  // Load portal view via GET call to /portal

  const reqUrl = '/portal';
  
  const requestData = {
    userType: 'individual',
    userId: res.userAccount,
    profId: res._id
  };
  
  // Create async request as promise object
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

  // Return promise object
  return promObj;  
}
  
  function loadPortalSuccess(res) {
    // Clears login/createAccount form, replaces with
    //  portal/createProfile content.
    
    // Replace HTML
    $('.content-wrapper').html(res);

    // Update CSS
    $('.content-wrapper').removeClass('login-wrapper');

  }

// Make available as module for testing purposes

try {
  module.exports = {
    loadIndProf,
    loadPositions,
    loadApplications,
    createIndProf,
    cancelIndProfEdit,
    editIndProf,
    submitApplication,
    handleEditIndProfClick,
    handlePosApplyClick,
    handlePosViewAppClick,
    toggleApplicationButton,
    determineAppButtonAction,
    deleteApplication,
    updateMain,
    updatePosAppView,
    updateAppViewApplyButton,
    handleError,
    moveToPortal,
    loadPortalSuccess
  };
}
catch(error) {
}
