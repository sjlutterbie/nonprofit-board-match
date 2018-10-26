'use strict';

// Handle click on "Create account" link (Toggle)

$('.js-create-account-link').click(toggleFormType);

  function toggleFormType(e) {
    e.preventDefault();

    // Check current state of form
    if (!$('.js-login-form').hasClass('create-account')) {
      // Log In -> CreateAccount
      $('.js-login-form').addClass('create-account');
      $('.js-login-form-heading').text('Create Account');
      $('.js-repeat-password').show();
      $('input[name="password-repeat"]').attr('required', true);
      $('.js-login-submit').val('Create Account');
      $('.js-create-account-link').text('Log In');
    } else {
      // Create Account -> Log In
      $('.js-login-form').removeClass('create-account');
      $('.js-login-form-heading').text('Log In');
      $('.js-repeat-password').hide();
      $('input[name="password-repeat"]').attr('required', false);
      $('.js-login-submit').val('Log In')
      $('.js-create-account-link').text('Create Account');
    }

  }

// Handle form submission

$('.js-login-form').submit(function(e) {
  e.preventDefault();
  chooseSubmitAction(e);
});

  function chooseSubmitAction(e) {
    e.preventDefault();
    
    let output;
    
    if($('.js-login-form').hasClass('create-account')) {
      // createUser Form
      output = createUser(e);
    } else {
      // logInUser Form
      output = logInUser(e);
    }
    
    return output;
    
  }
  
  // USER LOGIN PATHWAY
  
  function logInUser(e) {
    e.preventDefault();
    
    // Build submission data (username, password)
    const formData = {
      username: $('input[name="username"]').val(),
      password: $('input[name="password"]').val()
    };
    
    $.ajax({
      url: '/api/auth/login',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(formData),
      dataType: 'json',
      success: loadPortal,
      error: loginError
    });
      
    // For testing purposes 
    return 'logInUser';
  
  }

    function loadPortal(res) {

      const resUrl = '/portal';
      

      // Store the JWT in local storage
      localStorage.setItem('JWT', res.authToken)
      
      const requestData = {
        userType: res.userType,
        profID: res.user.indProf
      };
      
      let request = $.ajax({
        url: resUrl,
        type: 'GET',
        headers: {
          Authorization: `Bearer ${res.authToken}`,
          contentType: 'application/json'
        },
        data: requestData, // For finding userAccount
        success: loadPortalSuccess,
        error: loadPortalFailure
      });

    }
      
      function loadPortalSuccess(res) {
        
        // Clears html, to rebuild via the Portal
        //document.write(res);

        $('.content-wrapper').html(res);
        
        // Changes flexbox justify from center to start
        $('.content-wrapper').removeClass('login-wrapper');

        // For testing purposes
        return res;
        
      }
    
    
      function loadPortalFailure(res) {
        
        $('html').html(`${res.status}: ${res.responseText}`);
        
        // For testing purposes
        return res;
        
      }
    
    
    function loginError(res) {

      $('body').html(`${res.status}: ${res.responseText}`);
      
      // For testing purposes
      return res
    }
    
    
  
  function createUser(e) {
  
  // Verify password fields match
  const password = $('input[name="password"]').val();
  const passwordRepeat = $('input[name="password-repeat"]').val();
  
  if(password != passwordRepeat) {
    $('.alert-area').text('Passwords must match');
    return;
  }
  
  // Handle form submission
  const formData = {
    username: $('input[name="username"]').val(),
    password: $('input[name="password"]').val()
  };
  
  $.ajax({
      url: '/api/users',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(formData),
      dataType: 'json',
      success: createUserSuccess,
      error: createUserError
    });
  
    // For testing purposes
    return 'createUser';
    
  }
  
    function createUserSuccess(res) {
      
      $('.alert-area').text(`User '${res.username}' created! You may now log in.`);
      
      // Create null event
      const e = {
        preventDefault: function() {}
      }
      
      toggleFormType(e);
      
    }
    
    function createUserError(res) {
      
      $('.alert-area').text(
        `${res.responseJSON.reason}: ${res.responseJSON.message}`
      );
      
    }



  
// Make available as module for testing

try {
  module.exports = {
    toggleFormType,
    logInUser,
    createUser,
    chooseSubmitAction
  };
}
catch(error) {
}
