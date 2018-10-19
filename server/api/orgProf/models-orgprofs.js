'use strict';

const mongoose = require('mongoose');
  mongoose.Promise = global.Promise;
  
const orgProfSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  website: {type: String},
  email: {
    type: String,
    required: true
  },
  phone: { type: String},
  summary: {type: String},
  userAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  positions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Position'
    }  
  ]
});

const OrgProf = mongoose.model('OrgProf', orgProfSchema);

module.exports = {
  orgProfSchema,
  OrgProf
};