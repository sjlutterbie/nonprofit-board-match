'use strict';

const { editMode, createMode, staticMode } = require('./views');
const { getIndProfPromise } = require('./controllers');
const { router } = require('./router');


module.exports = {
  editMode, createMode, staticMode,
  getIndProfPromise,
  router
};