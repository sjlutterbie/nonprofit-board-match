'use strict';

const {applicationsSchema, Application} = require('./models-applications.js');
const {router} = require('./router-applications.js');

module.exports = {applicationsSchema, Application, router};