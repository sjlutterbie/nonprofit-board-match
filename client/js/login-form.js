'use strict';

// Handle click on "Create account" link (Toggle)
function formTypeToggle() {
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
      
    
  
// If jQuery is loaded this is running live
try {
  if ($) {
    formTypeToggle();
  }
}
// If $ is undefined, treat as a module (testing mode)
catch(error) {
  module.exports = {
    formTypeToggle
  };
}