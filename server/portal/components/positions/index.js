'use strict';

const { staticMode, makeStaticPosition } = require('./views');
const { getOpenPositionsPromise,
        getSinglePositionPromise,
        hasIndProfApplied} = require('./controllers');
const { router } = require('./router');

module.exports = {
  staticMode, makeStaticPosition,
  getOpenPositionsPromise, getSinglePositionPromise, hasIndProfApplied,
  router
};