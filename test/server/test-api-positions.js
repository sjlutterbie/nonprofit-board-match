'use strict';

// Load testing tools
const chai = require('chai');
const chaiHttp = require('chai-http');
  const expect = chai.expect;
  chai.use(chaiHttp);
const faker = require('faker');
const mongoose = require('mongoose');
  mongoose.Promise = global.Promise;
const jwt = require('jsonwebtoken');
const { app, runServer, closeServer} = require('../../index');
const { PORT, TEST_DATABASE_URL, JWT_SECRET } = require ('../../config');

// Load module
const {Position, positionsSchema} = require('../../server/api/positions');
const {User} = require('../../server/api/users');

// DATA MODEL TESTING

describe('Position API: Data Model', function() {
  
  it('Should be an object', function() {
    expect(positionsSchema).to.be.an('object');
  });
  it('OrgProf should include the expected keys', function() {
    const requiredKeys = ['title', 'description', 'dateCreated','orgProf',
    'applications'];
    expect(positionsSchema.obj).to.include.keys(requiredKeys);
  });
  
});