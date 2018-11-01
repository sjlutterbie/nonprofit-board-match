'use strict';

const { staticMode, createMode } = require('./views');
const { getApplicationPromise } = require('./controllers');
const { router } = require('./router');

module.exports = {
  staticMode, createMode,
  getApplicationPromise,
  router
};