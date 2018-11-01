'use strict';

function staticMode(application) {
  
  const outputHTML = `
    <div class="application-content">
      <h3>Cover message</h3>
      <p>${application.coverMessage}</p>
      <button class="js-application-withdraw"
              data-appid="${application._id}">Withdraw Application</button>
      <button class="js-application-hide">Hide Application</button>
    </div>
  `;
  
  return outputHTML;
  
}

function createMode() {
  
  const outputHTML = `
    <div class="application-form-wrapper">
      <form class="js-application-create">
        <fieldset>
          <legend>Apply with a cover message</legend>
          <input type="textarea" name="covermessage">
          <input type="button" class="js-application-cancel"
                 value="Cancel">
          <input type="reset" value="Reset">
          <input type="submit" class="js-application-submit"
                 value="Submit">
        </fieldset>
      </form>
    </div>
  `;
  
  return outputHTML;
  
}


////////////////////////////////////////////////////////////////////////////////

module.exports = {
  staticMode, createMode
};