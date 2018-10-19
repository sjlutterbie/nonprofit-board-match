'use strict';

const {indProfSchema, IndProf} = require('./models-indprofs.js');
const {router} = require('./router-indprofs.js');

module.exports = { indProfSchema, IndProf, router};