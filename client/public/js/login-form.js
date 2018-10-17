'use strict';

// Handle click on "Create account" link (Toggle)

$('.js-create-account-link').click(toggleFormType);

  function toggleFormType(e) {
  
  // Check whether an element has a specific class
    // Element: .js-login-form
    // Class: create-account
    
  // Change the visibility of an element
    // Element: .js-repeat-password
    
  // Change the text of an anchor element
    // Element: .js-create-account-link
    // Value switch: [Create Account | Log In]
  
  // Toggle element class
    // Element: .js-login-form
    // Class: create-account
  
  }


// Helper functions
  function checkElementForClass(elementIdentifier, cssClass) {
    
    // Verify parameters are strings
    [elementIdentifier, cssClass].forEach( parameter => {
      if(typeof parameter != 'string') {
        throw('checkElementForClass: Parameter is not a string');
      }
    });
    
    console.log('elementIdentifier: ' + elementIdentifier);
    console.log('cssClass: ' + cssClass);
    console.log('Output: ' + $(elementIdentifier).hasClass(cssClass))
    
    return $(elementIdentifier).hasClass(cssClass);

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
    checkElementForClass
  };
}
catch(error) {
}
