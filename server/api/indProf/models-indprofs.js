'use strict';

const mongoose = require('mongoose');
  mongoose.Promise = global.Promise;
  
const {User} = require('../users');
  
const indProfSchema  = mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: String,
  linkedIn: String,
  userAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  applications: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application'
    }  
  ]
});
  
const IndProf = mongoose.model('IndProf', indProfSchema);  

module.exports = {
  indProfSchema,
  IndProf
};