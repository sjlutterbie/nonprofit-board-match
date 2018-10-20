'use strict';

const mongoose = require('mongoose');
  mongoose.Promise = global.Promise;
  
const positionsSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  dateCreated: {
    type: Date,
    required: true
  },
  orgProf: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OrgProf',
    required: true
  },
  applications: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application'
    }
  ]
});

const Position = mongoose.model('Position', positionsSchema);

module.exports = {
  positionsSchema,
  Position
};