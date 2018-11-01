'use strict';

const { Application } = require('../../../api/applications');

function getApplicationPromise(appId) {
  // Retrive a single application, returning a Promise object to handle the
  //  async nature of the function.
  
  let query = Application.findById(appId).populate('position');
  
  let promObj = query.exec();
  
  return promObj;

}

module.exports = {
  getApplicationPromise
};