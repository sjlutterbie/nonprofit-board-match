'use strict';

const { staticMode } = require('./views');
const { getOpenPositionsPromise } = require('./index');
const { router } = require('./router');

module.exports = {
  staticMode,
  getOpenPositionsPromise,
  router
};