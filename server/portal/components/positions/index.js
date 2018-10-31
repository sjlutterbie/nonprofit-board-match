'use strict';

const { staticMode, makeStaticPosition } = require('./views');
const { getOpenPositionsPromise } = require('./controllers');
const { router } = require('./router');

module.exports = {
  staticMode, makeStaticPosition,
  getOpenPositionsPromise,
  router
};