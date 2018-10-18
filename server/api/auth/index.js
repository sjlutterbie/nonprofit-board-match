'use strict';
const {router} = require('./router-auth');
const {localStrategy, jwtStrategy} = require ('./strategies-auth');

module.exports = {router, localStrategy, jwtStrategy};