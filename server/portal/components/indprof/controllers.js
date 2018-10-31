'use strict';

const {IndProf} = require('../../../api/indProf');

function getIndProfPromise(profId) {
  // Retrieve an indProf, returning a Promise object to handle the async nature
  //  of the request
  
  let query = IndProf.findById(profId);
  
  let promObj = query.exec();
  
  return promObj;
  
}

////////////////////////////////////////////////////////////////////////////////

module.exports = {
  getIndProfPromise
};