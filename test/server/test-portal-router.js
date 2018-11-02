'use strict';

describe('Portal route', function() {
  
  describe('GET /portal', function() {

    it('Should reject users with no credentials', function() {
      return chai.request(app)
        .get('/portal')
        .then(function(res) {
          expect(res).to.have.status(401);
        });
    });
    
    it('Should reject user with an incorrect token', function() {
      // Run the test
      return chai.request(app)
        .get('/portal')
        .set('authorization', `Bearer ${token}XX`)
        .then(function(res) {
          expect(res).to.have.status(401);
        });
    });
    
    it('Should reject user with an expired token', function() {
      return chai.request(app)
        .get('/portal')
        .set('authorization', `Bearer ${expiredToken}`)
        .then(function(res) {
          expect(res).to.have.status(401);
        });
    });
    
    it('Should permit authenticated users', function() {

      // Build query url
      const queryUrl =
        `/portal?userType=individual&profId=${testIds.indProfId}`
        + `&userId=${testIds.userId}`;
      // Run the test
      return chai.request(app)
        .get(queryUrl)
        .set('authorization', `Bearer ${token}`)
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
        });
    });
  });
});