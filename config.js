'use strict';
exports.DATABASE_URL = process.env.DATABASE_URL ||
  'mongodb://a48fa83jaf:3V3DkJ6XA!xTHf@ds135003.mlab.com:35003/nonprofit-board-match';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL ||
  'mongodb://testUser:g3ttingTesty!@ds135003.mlab.com:35003/nonprofit-board-match-dev';
exports.PORT = process.env.PORT || 8080;