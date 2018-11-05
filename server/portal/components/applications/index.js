'use strict';

const { staticMode, createMode, listMode } = require('./views');
const { getApplicationPromise, getIndProfAppsPromise } = require('./controllers');
const { router } = require('./router');

module.exports = {
  staticMode, createMode, listMode,
  getApplicationPromise,getIndProfAppsPromise,
  router
};