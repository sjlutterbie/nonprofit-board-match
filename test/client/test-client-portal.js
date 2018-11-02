'use strict';

// Enable jQuery testing
const { JSDOM } = require('jsdom');
const window = new JSDOM(
  `<!DOCTYPE html><html><body></body></html>`).window;
global.$ = require('jquery')(window);

// Load required components
const cP = require('../../client/public/js/client-portal.js'); 

describe('Portal: Client-side user interaction', function() {
  
  describe('Menu items', function() {
    
    describe('loadIndProf()', function() {
      
      it('Should be a function', function() {
        expect(cP.loadIndProf).to.be.a('function');
      });
      
      it('Should return a promise', function() {
        // Create test event
        const event = {
          currentTarget: {
            dataset: { 
              usertype: faker.random.alphaNumeric(10),
              profid: faker.random.alphaNumeric(10),
              mode: faker.random.alphaNumeric(10)
            }
          }
        };
        // Run test
        let testObj = cP.loadIndProf(event, token);
        expect(testObj).to.be.a('promise');
        // Resolve/reject promise to avoid errors
        testObj.then(function(res){},function(err){});
      });
    });
    
    describe('loadPositions()', function() {
      
      it('Should be a function', function() {
        expect(cP.loadPositions).to.be.a('function');
      });
      
      it('Should return a promise', function() {
        // Create test event
        const event = {
          currentTarget: {
            dataset: { 
              usertype: faker.random.alphaNumeric(10),
              profid: faker.random.alphaNumeric(10)
            }
          }
        };
        // Run test
        let testObj = cP.loadPositions(event, token);
        expect(testObj).to.be.a('promise');
        // Resolve/reject promise avoid errors
        testObj.then(function(res){},function(err){});
      });
    });
    
    describe('loadApplications()', function() {
      
      it('Should be a function', function() {
        expect(cP.loadApplications).to.be.a('function');
      });
      
      it('Should return a promise', function() {
        // Create test event
        const event = {
          currentTarget: {
            dataset: { 
              usertype: faker.random.alphaNumeric(10),
              profid: faker.random.alphaNumeric(10)
            }
          }
        };
        // Run test
        let testObj = cP.loadApplications(event, token);
        expect(testObj).to.be.a('promise');
        // Resolve/reject promise avoid errors
        testObj.then(function(res){},function(err){});
      });
    });
  });
  
  describe('Form actions', function() {
    
    describe('createIndProf()', function() {
      
      it('Should be a function', function() {
        expect(cP.createIndProf).to.be.a('function');
      });

      it('Should return a promise', function() {
        // Create test DOM
        $('body').html(`
          <form>
            <input name="firstname" value="${faker.name.firstName()}">
            <input name="lastName" value="${faker.name.lastName()}">
            <input name="email" value="${faker.internet.email()}">
            <input name="phone" value="${faker.phone.phoneNumber()}">
            <input name="linkedin" value="${faker.internet.url()}">
            <input name="userid" value="${faker.random.alphaNumeric(10)}">
          </form>
        `);
        // Run test
        let testObj = cP.createIndProf(token);
        expect(testObj).to.be.a('promise');
        // Resolve/reject promise to avoid errors
        testObj.then(function(res){},function(err){});
        // Reset test DOM
        $('body').html();
      });
    });
    
    describe('cancelIndProfEdit()', function() {
      
      it('Should be a function', function() {
        expect(cP.cancelIndProfEdit).to.be.a('function');
      });

      it('Should return a promise', function() {
        // Create test event
        const event = {
          currentTarget: {
            dataset: {
              userid: faker.random.alphaNumeric(10),
              profId: faker.random.alphaNumeric(10)
            }
          }
        };
        // Run test
        let testObj = cP.cancelIndProfEdit(event, token);
        expect(testObj).to.be.a('promise');
        // Resolve/reject promise to avoid errors
        testObj.then(function(res){},function(err){});
      });
    });
    
    describe('editIndProf()', function() {

      it('Should be a function', function() {
        expect(cP.editIndProf).to.be.a('function');
      });

      it('Should return a promise', function() {
        // Create test DOM
        $('body').html(`
          <form>
            <input name="firstname" value="${faker.name.firstName()}">
            <input name="lastName" value="${faker.name.lastName()}">
            <input name="email" value="${faker.internet.email()}">
            <input name="phone" value="${faker.phone.phoneNumber()}">
            <input name="linkedin" value="${faker.internet.url()}">
            <input name="userid" value="${faker.random.alphaNumeric(10)}">
            <input name="profid" value="${faker.random.alphaNumeric(10)}">
          </form>
        `);
        // Run test
        let testObj = cP.editIndProf(token);
        expect(testObj).to.be.a('promise');
        // Resolve/reject promise to avoid errors
        testObj.then(function(res){},function(err){});
        // Reset test DOM
        $('body').html();
      });
    });
    
    describe('submitApplication()', function() {
      
      it('Should be a function', function() {
        expect(cP.submitApplication).to.be.a('function');
      });
      
      it('Should return a promise', function() {
        let testObj = cP.submitApplication();
        expect(testObj).to.be.a('promise');
        // Resolve/reject promise to avoid errors
        testObj.then(function(res){},function(rej){});
      });
    });
  });
  
  describe('Non-Form Buttons', function() {
  
    describe('handleEditIndProfClick()', function() {

      it('Should be a function', function() {
        expect(cP.handleEditIndProfClick).to.be.a('function');
      });
      
      it('Should return a promise', function() {
        // Create test event
        const event = {
          currentTarget: {
            dataset: {
              userAccount: faker.random.alphaNumeric(10),
              profId: faker.random.alphaNumeric(10)
            }
          }
        };
        // Run test
        let testObj = cP.handleEditIndProfClick(event, token);
        expect(testObj).to.be.a('promise');
        // Resolve/reject promise to avoid errors
        testObj.then(function(res){},function(err){});
      });
    });
    
    describe('handlePosApplyClick()', function() {
      
      it('Should be a function', function() {
        expect(cP.handlePosApplyClick).to.be.a('function');
      });
      
      it('Should return a promise', function() {
        const event = {}
        let testObj = cP.handlePosApplyClick(event, token);
        expect(testObj).to.be.a('promise');
        // Resolve/reject promise to avoid errors
        testObj.then(function(res){},function(err){});
      });
    });
    
    describe('handlePosViewAppClick()', function() {

      it('Should be a function', function() {
        expect(cP.handlePosViewAppClick).to.be.a('function');
      });
      
      it('Should return a promise', function() {
        const appId = faker.random.alphaNumeric(10);
        let testObj = cP.handlePosViewAppClick(appId, token);
        expect(testObj).to.be.a('promise');
        // Resolve/reject promise to avoid errors
        testObj.then(function(res){}, function(err){});
      });

    });
    
    describe('deleteApplication()', function() {
      
      it('Should be a function', function() {
        expect(cP.deleteApplication).to.be.a('function');
      });
      
      it('Should return a promise', function() {
        const appId = faker.random.alphaNumeric(10);
        let testObj = cP.deleteApplication(appId, token);
        expect(testObj).to.be.a('promise');
        // Resolve/reject promise to avoid errors
        testObj.then(function(res){},function(err){});
      });
    });
  });

  describe('Helper functions', function() {
  
    describe('updateMain()', function() {
      
      it('Should be a function', function() {
        expect(cP.updateMain).to.be.a('function');
      });
        
      it('Should update the <main> element', function() {
        // Set up test DOM & content
        $('body').html('<main></main>');
        const testContent = 'foo';
        // Run the test
        cP.updateMain(testContent);
        expect($('main').html()).to.equal(testContent);
        // Reset test DOM
        $('body').html();
      });
    });
    
    describe('updatePosAppView()', function() {
      
      it('Should be a function', function() {
        expect(cP.updatePosAppView).to.be.a('function');
      });
      
      it('Should update the DOM as expected', function() {
        const posId = faker.random.alphaNumeric(10);
        const content = faker.random.alphaNumeric(10);
        // Create test DOM
        $('body').html(`
          <div data-posid="${posId}">
            <div class="application-view"></div>
          </div>
        `);
        // Run test
        cP.updatePosAppView(content, posId);
        expect($('.application-view').text()).to.equal(content);
        // Reset test DOM
        $('body').html('');
      });
    });
    
    describe('toggleApplicationButton()', function() {
      
      it('Should be a function', function() {
        expect(cP.toggleApplicationButton).to.be.a('function');
      });
      
      it('Should update the DOM as expected', function() {
        const posId = faker.random.alphaNumeric(10);
        // Create test DOM
        $('body').html(`
          <button class="wasvisible js-position-app-handler"
                  data-posid="${posId}"></button>
          <button class="washidden js-position-app-handler"
                  data-posid="${posId}"
                  style="display: none;"></button>
        `);
        // Run test
        cP.toggleApplicationButton(posId);
        expect($('.wasvisible').css('display')).to.equal('none');
        expect($('.washidden').css('display')).to.equal('inline-block');
        // Reset test DOM
        $('body').html('');
      });
    });
    
    describe('determineAppButtonAction()', function() {
      
      it('Should be a function', function() {
        expect(cP.determineAppButtonAction).to.be.a('function');
      });
      it('Should detect the expected class in the DOM', function() {
        const testCases = ['apply', 'viewapp'];
        testCases.forEach(function(testCase) {
          // Create test DOM
          $('body').html(`
            <button class="${testCase}"></button>
          `);
          // Run test
          expect(cP.determineAppButtonAction($('button'))).to.equal(testCase);
          // Reset test DOM
          $('body').html('');
        });
      });
    });
    
    describe('updateAppViewApplyButton()', function() {
      
      it('Should be a function', function() {
        expect(cP.updateAppViewApplyButton).to.be.a('function');
      });
      it('Should update the DOM as expected', function() {
        const posId1 = faker.random.alphaNumeric(10);
        const posId2 = faker.random.alphaNumeric(10);
        // Create test DOM
        $('body').html(`
          <button class="button1 js-position-app-handler apply"
                  data-posid="${posId1}">Start text 1</button>
          <button class="button2 js-position-app-handler viewapp"
                  data-posid="${posId2}">Start text 2</button>
        `);
        // Run tests
        cP.updateAppViewApplyButton(posId1, posId1, 'viewapp', posId1);
          expect($('.button1').text()).to.equal(posId1)
          expect($('.button1').hasClass('viewapp')).to.equal(true);
          expect($('.button1').attr('data-appid')).to.equal(posId1);
        cP.updateAppViewApplyButton(posId2, posId2, 'apply', '');
          expect($('.button2').text()).to.equal(posId2)
          expect($('.button2').hasClass('apply')).to.equal(true);
          expect($('.button2').attr('data-appid')).to.equal('');
        // Reset test DOM
        $('body').html('');
      });
    });
    
    
    describe('handleError()', function() {
      
      it('Should be a function', function() {
        expect(cP.handleError).to.be.a('function');
      });
    });
    
    describe('moveToPortal()', function() {
      
      it('Should be a function', function() {
        expect(cP.moveToPortal).to.be.a('function');
      });
      
      it('Should return a promise', function() {
        // Create test response
        const res = {
          userAccount: faker.random.alphaNumeric(10),
          _id: faker.random.alphaNumeric(10)
        };
        // Run test
        let testObj = cP.moveToPortal(res, token);
        expect(testObj).to.be.a('promise');
        // Resolve/reject promise to avoid errors
        testObj.then(function(res){},function(err){});
      });
    });
    
    describe('loadPortalSuccess()', function() {
      it('Should be a function', function() {
        expect(cP.loadPortalSuccess).to.be.a('function');
      });
      
      it('Should update the DOM as expected', function() {
        // Create test DOM
        $('body').html(`
          <div class="content-wrapper login-wrapper"></div>
        `);
        // Create test response
        const res = faker.random.alphaNumeric(10);
        // Run test
        cP.loadPortalSuccess(res);
        expect($('.content-wrapper').text()).to.equal(res);
        expect($('.content-wrapper').hasClass('login-wrapper')).to.equal(false);
        // Reset test DOM
        $('body').html('');
      });
    });
  });
});