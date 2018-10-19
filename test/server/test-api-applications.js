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
const {Application, applicationsSchema} = require('../../server/api/applications');
const {User} = require('../../server/api/users');
const {Position} = require('../../server/api/positions');

// DATA MODEL TESTING

describe('Applications API: Data Model', function() {
  
  it('Should be an object', function() {
    expect(applicationsSchema).to.be.an('object');
  });
  it('Application should include the expected keys', function() {
    const requiredKeys = ['coverMessage', 'applicationDate', 'position',
      'indProf'];
    expect(applicationsSchema.obj).to.include.keys(requiredKeys);
  });
  
});