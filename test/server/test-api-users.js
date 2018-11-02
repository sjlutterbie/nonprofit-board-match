'use strict';

//Load requied components
const { User, UserSchema } = require('../../server/api/users');

describe('Users API', function() {
  
  describe('Data model', function() {
    
    it('Should be an object', function() {
      expect(UserSchema).to.be.an('object');
    });
    
    it('Should include the expected keys', function() {
      const requiredKeys = ['username', 'password', 'firstName', 'lastName',
        'indProf'];
      expect(UserSchema.obj).to.include.keys(requiredKeys);
    });
  });
  
  describe('Routes', function() {
    
    describe('POST /', function() {
    
      it('Should reject requests with missing fields', function() {
        const testCases = [
          // Missing username
          {password: faker.random.alphaNumeric(10)},
          // Missing password
          {username: faker.random.alphaNumeric(10)}
        ];
        testCases.forEach(function(testCase){
          return chai.request(app)
            .post('/api/users')
            .send(testCase)
            .then(function(res){
              expect(res).to.have.status(422);
            });
        });
      });

      it('Should reject requests with non-string fields', function() {
        const testCases = [
          {
            username: 1234,
            password: faker.random.alphaNumeric(10),
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName()
          },
          {
            username: faker.random.alphaNumeric(10),
            password: 1234,
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName()
          },
          {
            username: faker.random.alphaNumeric(10),
            password: faker.random.alphaNumeric(10),
            firstName: 1234,
            lastName: faker.name.lastName()
          },
          {
            username: faker.random.alphaNumeric(10),
            password: faker.random.alphaNumeric(10),
            firstName: faker.name.firstName(),
            lastName: 1234
          }
        ];
        testCases.forEach(function(testCase){
          return chai.request(app)
            .post('/api/users')
            .send(testCase)
            .then(function(res){
              expect(res).to.have.status(422);
            });
        });
      });
      
      it('Should reject requests with non-trimmed fields', function() {
        const testCases = [
          {
            username: `   ${faker.random.alphaNumeric(10)}  `,
            password: faker.random.alphaNumeric(10),
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName()
          },
          {
            username: faker.random.alphaNumeric(10),
            password: `  ${faker.random.alphaNumeric(10)}  `,
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName()
          }
        ];
        testCases.forEach(function(testCase){
          return chai.request(app)
            .post('/api/users')
            .send(testCase)
            .then(function(res){
              expect(res).to.have.status(422);
            });
        });
      });
      
      it('Should reject requests with too short/long fields', function() {
        const testCases = [
          {
            // Min username length = 1
            username: '',
            password: faker.random.alphaNumeric(10),
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName()
          },
          {
            username: faker.random.alphaNumeric(10),
            // Min password length = 10
            password: faker.random.alphaNumeric(9),
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName()
          },
          {
            username: faker.random.alphaNumeric(10),
            // Maximum password length = 75
            password: faker.random.alphaNumeric(76),
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName()
          }
        ];
        testCases.forEach(function(testCase){
          return chai.request(app)
            .post('/api/users')
            .send(testCase)
            .then(function(res){
              expect(res).to.have.status(422);
            });
        });
      });
      
      it('Should reject requests with an existing username', function() {
        const testUser = {
          username: faker.random.alphaNumeric(10),
          password: faker.random.alphaNumeric(10)
        };
        User.create(testUser)
          .then(function(user){
            return chai.request(app)
              .post('/api/users')
              .send(testUser)
              .then(function(res){
                expect(res).to.have.status(422);
              });
          })
          .catch(function(err){
            console.log(err);
          });
      });
      
      it('Should successfully create a user for a valid request', function() {
        const testUser = {
          username: faker.random.alphaNumeric(10),
          password: faker.random.alphaNumeric(10)
        };
        return chai.request(app)
          .post('/api/users')
          .send(testUser)
          .then(function(res){
            expect(res).to.have.status(201);
            expect(res).to.be.an('object');
            expect(res.body).to.include.keys(['username', 'firstName',
                                              'lastName', 'indProf', 'userId']);
          });
      });
    });
  });
});