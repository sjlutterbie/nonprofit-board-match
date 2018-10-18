'use strict';

const mongoose = require('mongoose');
  mongoose.Promise = global.Promise;
  
const {User} = require('../users');
  
const IndProf  = mongoose.Schema({
  overview: {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: String,
    phone: String
  },
  linkedIn: String,
  experience: {},
  userAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'}
});
  
  
  
module.exports = {
  IndProf
};