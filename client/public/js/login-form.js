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

      // DEVELOPMENT: Request simple 'protected page'
      const resUrl = '/api/protected';
      
      // TODO: Elevate resUrl to function parameter, to enable testing

      // DEVELOPMENT: Request a protected page
      let request = $.ajax({
        url: resUrl,
        type: 'GET',
        headers: {
          Authorization: `Bearer ${res.authToken}`,
          contentType: 'application/json'
        },
        success: loadPortalSuccess,
        error: loadPortalFailure
      });
        
    }
      
      function loadPortalSuccess(res) {
        
        $('body').html(res.data);
        
        // For testing purposes
        return res;
        
      }
    
    
      function loadPortalFailure(res) {
        
        $('body').html(`${res.status}: ${res.responseText}`);
        
        // For testing purposes
        return res;
        
      }
    
    
    function loginError(res) {

      $('body').html(`${res.status}: ${res.responseText}`);
      
      // For testing purposes
      return res
    }
    
    
  
  function createUser(e) {
  
  
  
    // For testing purposes
    return 'createUser';
    
  }


   // If form does NOT have class 'create-account':
    // Convert login form to create account form
      // Display "repeat password" input
      // Add "create-account" class to form element
      // Change "Create account" link to "Log in"
  // If form HAS class 'create-account':
    // Convert create account form to login form
      // Hide "repeat password" input
      // Remove "create-account" class from form element
      // Change "Log in" link to "Create Account"
 

// Handle form submission
  // If form does NOT have class "create-account"
    // POST user authorization
      // If failed:
        // Display error, reset form
      // If success:
        // Redirect to /portal
  // If form HAS class 'create-account'
    // Handle client-side username/password validation
    // POST account creation
      // If failed:
        // Display error, reset form
      // If success:
        // Redirect to /portal
  
  
 
      
    


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
