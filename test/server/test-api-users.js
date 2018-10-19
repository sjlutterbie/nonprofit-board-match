'use strict';

// Load testing packages
const chai = require('chai');
  const expect = chai.expect;
const chaiHttp = require('chai-http');
  chai.use(chaiHttp);
const mongoose = require('mongoose');
  mongoose.Promise = global.Promise;

const jwt = require('jsonwebtoken');
const { app, runServer, closeServer } = require('../../index');
const { PORT, TEST_DATABASE_URL, JWT_SECRET } = require('../../config');
  
//Load module
const { User } = require('../../server/api/users');

describe('/api/users', function() {

  describe('POST / (create user)', function() {
    
    // TODO
    
  });  
  
  describe('GET /:id (retrieve userAccount information)', function() {
    
    it('Should reject unauthenticated users', function() {
      
    });
    
    
  });
  
});