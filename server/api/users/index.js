'use strict';
const {User, UserSchema} = require('./models-users');
const {router} = require('./router-users');

module.exports = { User, UserSchema, router};