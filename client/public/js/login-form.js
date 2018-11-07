'use strict';

/*
Handles user interactions on the login form and "create individual profile"
  form. Upon login (and creation of an individual profile, if necessary),
  loads the 'portal view', after which point user interactions are handled by
  client-portal.js
*/


// Handle click on "Create account" link (Toggle)

$('html').on('click', '.js-create-account-link', e => 
  toggleFormType(e));

  function toggleFormType(e) {
    e.preventDefault();

    // Check current state of form
    if (!$('.js-login-form').hasClass('create-account')) {
      // Convert 'Log In' -> 'CreateAccount'
      $('.js-login-form').addClass('create-account');
      $('.js-login-form-heading').text('Create Account');
      $('.js-password-requirements').css('display', 'block');
      $('.js-repeat-password').show();
      $('input[name="password-repeat"]').attr('required', true);
      $('.js-login-submit').val('Create Account');
      $('.js-create-account-link').text('Log In');
      $('.default-credentials').hide();
    } else {
      // Convert 'Create Account' -> 'Log In'
      $('.js-login-form').removeClass('create-account');
      $('.js-login-form-heading').text('Log In');
      $('.js-password-requirements').css('display', 'none');
      $('.js-repeat-password').hide();
      $('input[name="password-repeat"]').attr('required', false);
      $('.js-login-submit').val('Log In')
      $('.js-create-account-link').text('Create Account');
      $('.default-credentials').show();
    }
  }

// Handle login/createAccount form submission

$('.js-login-form').submit(function(e) {
  e.preventDefault();
  
  const formAction = chooseSubmitAction();
  
  if (formAction === 'createUser') {
    // Handles ajax call as promise object
    createUser() 
      .then(createUserSuccess)
      .catch(createUserError);
  } else {
    // Handle ajax call as promise object
    logInUser()
      .then(function(res) {
        storeJWTToken(res);
        
        // Determine which user path to follow
        let pathFunction;
        
        if(res.user.indProf) {
          pathFunction = loadPortal;
        } else {
          pathFunction = loadCreateIndProf;
        }
        
        // Execute user path
        pathFunction(res)
          .then(loadContentSuccess);
      }) 
      // Catch statement for all above promises
      .catch(loadContentFailure);
  }
});

  function chooseSubmitAction() {
    // Create a new user, or log in an existing user?

    let output;
    
    if($('.js-login-form').hasClass('create-account')) {
      // Use form submission event to create a new user
      output = 'createUser';
    } else {
      // Use form submission event to log in an existing user
      output = 'logInUser';
    }
    
    return output;
  }

// USER LOGIN PATHWAY

function logInUser() {
  // Submit login ajax request as promise, return promise object

  // Extract submission data
  const formData = {
    username: $('input[name="username"]').val(),
    password: $('input[name="password"]').val()
  };
  
  // Create ajax call as promise
  let promObj = new Promise(function(resolve, reject) {
      $.ajax({
        url: '/api/auth/login',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        dataType: 'json',
        success: resolve,
        error: reject
      });
    });
    
  return promObj;
}

  function storeJWTToken(res) {
    // Upon successful login, store the JWT token for session authentication

    localStorage.setItem('JWT', res.authToken)
    
  }

  function loadCreateIndProf(res) {
    // Request the indProf user creation form from the server
    
    // Create data for API call
    const requestData = {
      userType: res.userType,
      userId: res.user.userId,
      mode: 'create'
    };
    
    // Set API url
    const reqUrl = '/portal/components/indprof';
    
    let promObj = new Promise(function(resolve, reject) {
      
      // Execute the request
      $.ajax({
        url: reqUrl,
        type: 'GET',
        headers: {
          Authorization: `Bearer ${res.authToken}`,
          contentType: 'application/json'
        },
        data: requestData,
        success: resolve,
        error: reject
      });
    });
    
    return promObj;

  }
  
  function loadPortal(res) {
    // Request the portal interface from the server

    // Create data for API call      
    const requestData = {
      userType: res.userType,
      userId: res.user.userId,
      profId: res.user.indProf
    };
    
    // Set API url
    const reqUrl = '/portal';

    let promObj = new Promise(function(resolve, reject) {
    
      // Execute the request
      $.ajax({
        url: reqUrl,
        type: 'GET',
        headers: {
          Authorization: `Bearer ${res.authToken}`,
          contentType: 'application/json'
        },
        data: requestData,
        success: resolve,
        error: reject
      });
    });

    return promObj;

  }
    
    function loadContentSuccess(res) {
      // Clears login/createAccount form, replaces with
      //  portal/createProfile content.
      
      // Replace HTML
      $('.content-wrapper').html(res);

      // Update CSS
      $('.content-wrapper').removeClass('login-wrapper');

      // For testing purposes
      return res;
      
    }
  
    function loadContentFailure(res) {
      
      $('.alert-area').html(`${res.status}: ${res.responseText}`.trim());
      
      // For testing purposes
      return res;
      
    }

// USER CREATION PATHWAY

  function createUser() {
  // Perform initial form validation and submit user creation request as a 
  //  promise; return promise object.
  
  
  // Verify password fields match
  const password = $('input[name="password"]').val();
  const passwordRepeat = $('input[name="password-repeat"]').val();
  
  if (!verifyPasswordMatch(password, passwordRepeat)){
    $('.alert-area').text('Passwords must match');
    // Cancel form submission without clearing contents
    return;
  }
  
  // Extract form data
  const formData = {
    username: $('input[name="username"]').val(),
    password: $('input[name="password"]').val()
  };
  
  let promObj = new Promise(function(resolve, reject) {
    // Execute API call
    $.ajax({
        url: '/api/users',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        dataType: 'json',
        success: resolve,
        error: reject
      });
  });

  return promObj;

  }
  
    function verifyPasswordMatch(password, passwordRepeat) {
      // Verify password === passwordRepeat
      return (password === passwordRepeat);
    }
  
    function createUserSuccess(res) {
      // Inform user account was created, and convert createUser form to
      //  pre-populated login form
      
      $('.alert-area')
        .text(`User '${res.username}' created! You may now log in.`);
      
      // Create null event, enabling toggleFormType(e) call
      const e = {
        preventDefault: function() {}
      };
      
      // Switch from createUser to login form
      toggleFormType(e);
      
    }
    
    function createUserError(err) {
      // Inform user of account creation error, without clearing form data
    
      $('.alert-area').text(
        `${err.responseJSON.reason}: ${err.responseJSON.message}`
      );
      
      return;
      
    }
    
// Clear alerts once user clicks an element on the page

$('html').on('click', 'body', function(e) {
  
  // Clear the alert area
  $('.alert-area').html('');

});

////////////////////////////////////////////////////////////////////////////////

// Make functions available as module for testing
try {
  module.exports = {
    toggleFormType,
    chooseSubmitAction,
    logInUser,
    storeJWTToken,
    loadCreateIndProf,
    loadPortal,
    loadContentSuccess,
    loadContentFailure,
    createUser,
    verifyPasswordMatch,
    createUserSuccess,
    createUserError
  };
}
catch(error) {
  // Not an error: Just loading the functions client-side
}
