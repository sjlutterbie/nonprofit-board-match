'use strict';

const {positionsSchema, Position} = require('./models-positions.js');
const {router} = require('./router-positions.js');

module.exports = {positionsSchema, Position, router};