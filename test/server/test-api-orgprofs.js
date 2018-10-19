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
const {OrgProf, orgProfSchema} = require('../../server/api/orgProf');
const {User} = require('../../server/api/users');

// DATA MODEL TESTING

describe('OrgProf API: Data Model', function() {
  
  it('Should be an object', function() {
    expect(orgProfSchema).to.be.an('object');
  });
  it('OrgProf should include the expected keys', function() {
    const requiredKeys = ['name', 'website', 'email', 'phone', 'summary',
      'userAccount', 'positions'];
    expect(orgProfSchema.obj).to.include.keys(requiredKeys);
  });
  
});