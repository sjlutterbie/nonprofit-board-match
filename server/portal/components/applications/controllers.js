'use strict';

const { Application } = require('../../../api/applications');

function getApplicationPromise(appId) {
  // Retrive a single application, returning a Promise object to handle the
  //  async nature of the function.
  
  let query = Application.findById(appId).populate('position');
  
  let promObj = query.exec();
  
  return promObj;

}

function getIndProfAppsPromise(indProfId) {
  
  // A better route for this would be to go through indProf, and collect all
  //  the applications associated with the indProf. Then, I can run a similar
  //  view building route. I *think* this will be closer to the truth than
  //  the current data I'm receiving.
  
  let query = Application.find({indProf: indProfId})
    .populate(
      {
        path: 'position',
        populate: { path: 'orgProf' }
      }
      );
  
  let promObj = query.exec();
  
  return promObj;
  
}


////////////////////////////////////////////////////////////////////////////////

module.exports = {
  getApplicationPromise, getIndProfAppsPromise
};