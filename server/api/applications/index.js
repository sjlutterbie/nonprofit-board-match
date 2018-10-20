'use strict';

const {applicationsSchema, Application} = require('./models-applications');
const {router} = require('./router-applications');

module.exports = {applicationsSchema, Application, router};