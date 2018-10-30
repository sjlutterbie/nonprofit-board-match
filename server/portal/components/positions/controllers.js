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

module.exports = {
  getOpenPositionsPromise
};