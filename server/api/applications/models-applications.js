'use strict';

const mongoose = require('mongoose');
  mongoose.Promise = global.Promise;

const applicationsSchema = mongoose.Schema({
  coverMessage: {
    type: String,
    required: true
  },
  applicationDate: {
    type: Date,
    required: true
  },
  position: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Position',
    required: true
  },
  indProf: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'IndProf',
    required: true
  } 
});

const Application = mongoose.model('Application', applicationsSchema);

module.exports = {
  applicationsSchema,
  Application
};