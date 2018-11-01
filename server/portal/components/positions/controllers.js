'use strict';

const {Position} = require('../../../api/positions');

function getOpenPositionsPromise() {
  // Retrieve all open positions, returning a Promise object to handle the
  //  async nature of the request.
  
  let query = Position
    .find({currentlyOpen: true})
    .sort({dateCreated: 'descending'})
    .populate('orgProf');
  
  let promObj = query.exec();
  
  return promObj;
  
}

function getSinglePositionPromise(posId) {
  // Retrieve a single position, returning a Promise object to handle the
  //  async nature of the request
  
  let query = Position
    .findById(posId)
    .populate('orgProf')
    .populate('applications');
    
  let promObj = query.exec();
  
  return promObj;
  
}

function hasIndProfApplied(position, indProf) {
  // Check whether or not `position` has an `application` connected to `indProf`
  // If it does, return the application.
  // If not, return false
  
  console.log(position);
  
  
}

module.exports = {
  getOpenPositionsPromise,
  getSinglePositionPromise,
  hasIndProfApplied
};