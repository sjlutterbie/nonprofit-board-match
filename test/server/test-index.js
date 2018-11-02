'use strict';

describe('Index-defined routes', function() {

  describe('Test static route (/)', function() {
      
    it('Should return a 200 status code', function() {
      return chai.request(app)
        .get('/')
        .then(function(res) {
          expect(res).to.have.status(200);
        });
    });
  });
  
  describe('Test catchall route', function() {
    
    it('Should return a 404 status code', function() {
      const fakeRoute = '/' + faker.random.alphaNumeric(20);
      return chai.request(app)
        .get(fakeRoute)
        .then(function(res) {
          expect(res).to.have.status(404);
        });
    });
  });
});
