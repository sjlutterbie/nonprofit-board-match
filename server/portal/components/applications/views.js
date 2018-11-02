'use strict';

function staticMode(application, posId) {
  
  const outputHTML = `
    <div class="application-content">
      <h3>Cover message</h3>
      <p>${application.coverMessage}</p>
      <button class="js-application-withdraw"
              data-appid="${application._id}"
              data-posid="${posId}">Withdraw Application</button>
      <button class="js-application-hide"
              data-posid="${posId}">Hide Application</button>
    </div>
  `;
  
  return outputHTML;
  
}

function createMode(posId, profId) {
  
  const outputHTML = `
    <div class="application-form-wrapper">
      <form class="js-application-create"
            data-posid="${posId}"
            data-profid="${profId}">
        <fieldset>
          <legend>Apply with a cover message</legend>
          <input type="textarea" name="covermessage" required>
          <input type="button" class="js-application-cancel"
                 data-posid="${posId}" value="Cancel">
          <input type="reset" value="Reset">
          <input type="submit" class="js-application-submit"
                 data-posid="${posId}" value="Submit">
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