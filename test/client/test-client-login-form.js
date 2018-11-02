'use strict';

// Enable jQuery testing
const { JSDOM } = require('jsdom');
const window = new JSDOM(
  `<!DOCTYPE html><html><body></body></html>`).window;
global.$ = require('jquery')(window);

// Load required components
require('dotenv').config();
const lF = require('../../client/public/js/login-form');

describe('Login form JS', function() {
  
  describe('User Interactions', function() {
    
    describe('[Create Account | Log in] link', function() {
    
      describe('toggleFormType function', function() {
        
        it('Should be a function', function() {
          expect(lF.toggleFormType).to.be.a('function');
        });
        
      });
      
      describe('toggleFormType: DOM manipulation', function() {
  
        it('Should transform the Login form to a Create Account form', function(){
          // Create test DOM
          $('body').html(`
             <div class="js-login-form"></div>
             <div class="js-login-form-heading">Log In</div>
             <input type="text" class="js-repeat-password"
                    name="password-repeat" style="display: none;"></input>
             <input type="submit" value="Log In" class="js-login-submit"></input>
             <a class="js-create-account-link">Create Account</a>
          `);  
          // Create the 'event' object;
          const e = {
            preventDefault: sinon.spy()
          };
          // Trigger the event
          lF.toggleFormType(e);
          // Evaluate results
          expect(e.preventDefault.called).to.equal(true);
          expect($('.js-login-form').hasClass('create-account')).to.equal(true);
          expect($('.js-login-form-heading').text()).to.equal('Create Account');
          expect($('.js-repeat-password').css('display')).to.equal('inline-block');
          expect($('.js-repeat-password').prop('required')).to.equal(true);
          expect($('.js-login-submit').val()).to.equal('Create Account');
          expect($('.js-create-account-link').text()).to.equal('Log In');
          //Reset test DOM
          $('body').html('');
        });
        
        it('Should transform the Create Account form to a Log In form', function(){
          // Create test DOM
          $('body').html(`
             <div class="js-login-form create-account"></div>
             <div class="js-login-form-heading">Create Account</div>
             <input type="text" class="js-repeat-password"
                    name="password-repeat" style="display: block;" required></input>
             <input type="submit" value="Create Account" class="js-login-submit"></input>
             <a class="js-create-account-link">Log In</a>
          `);  
          // Create the 'event' object
          const e = {
            preventDefault: sinon.spy()
          };
          // Trigger the event
          lF.toggleFormType(e);
          // Evaluate results
          expect(e.preventDefault.called).to.equal(true);
          expect($('.js-login-form').hasClass('create-account')).to.equal(false);
          expect($('.js-login-form-heading').text()).to.equal('Log In');
          expect($('.js-repeat-password').css('display')).to.equal('none');
          expect($('.js-repeat-password').prop('required')).to.equal(false);
          expect($('.js-login-submit').val()).to.equal('Log In');
          expect($('.js-create-account-link').text()).to.equal('Create Account');
          //Reset test DOM
          $('body').html('');
        });
      });
    });
  });

  describe('Form submission', function() {
    
    describe('Function unit tests', function() {
    
      describe('chooseSubmitAction(e)', function() {
        
        it('Should be a function', function() {
          expect(lF.chooseSubmitAction).to.be.a('function');
        });
        
        it('Should return a string', function() {
          expect(lF.chooseSubmitAction()).to.be.a('string');
        });
    
        it('Should evaluate the DOM correctly', function() {
          // Create 'login form' test DOM
          $('body').html(`
            <div class="js-login-form"></div>
          `);
          // Run test
          expect(lF.chooseSubmitAction()).to.equal('logInUser');
          // Create 'create user' test DOM
          $('body').html(`
            <div class="js-login-form create-account"></div>
          `);
          // Run test
          expect(lF.chooseSubmitAction()).to.equal('createUser');
          // Reset test DOM
          $('body').html('');
        });
      }); 
      
      describe('logInUser()', function() {
        it('Should be a function', function() {
          expect(lF.logInUser).to.be.a('function');
        });
        it('Should return a promise', function() {
          // Create test DOM
          $('body').html(`
            <form>
              <input name="username" val="${faker.random.alphaNumeric(10)}">
              <input name="password" val="${faker.random.alphaNumeric(10)}">
            </form>
          `);
          // Run test
          let testObj = lF.logInUser(); 
          expect(testObj).to.be.a('promise');
          // Resolve/reject promise to avoid errors
          testObj.then(function(res){}, function(err){});
          // Reset test DOM
          $('body').html('');
          // See 'Promise testing' for full functionality testing
        });
      });
  
      describe('storeJWTToken', function() {
        it('Should be a function', function() {
          expect(lF.storeJWTToken).to.be.a('function');
        });
        it('Should store an object `JWT` in `localStorage`', function() {
          // Create test res object
          const res = {
            authToken: 'foo'
          };
          lF.storeJWTToken(res);
          expect(localStorage.JWT).to.equal('foo');
        });
      });
      
      describe('loadCreateIndProf()', function() {
        it('Should be a function', function() {
          expect(lF.loadCreateIndProf).to.be.a('function');
        });
        it('Should return a promise', function() {
          // Create response object
          const res = {
            userType: 'individual',
            user: {
              userId: faker.random.alphaNumeric(10)
            },
            authToken: faker.random.alphaNumeric(10)
          };
          // Run test
          let testObj = lF.loadCreateIndProf(res);
          expect(testObj).to.be.a('promise');
          // Resolve/reject promise to avoid errors
          testObj.then(function(result){}, function(err){});
        });
        // See 'Promise testing' for full functionality testing
      });
      
      describe('loadPortal()', function() {
        it('Should be a function', function() {
          expect(lF.loadPortal).to.be.a('function');
        });
        it('Should return a promise', function() {
          // Create test response object
          const res = {
            userType: faker.random.alphaNumeric(10),
            user: {
              userId: faker.random.alphaNumeric(10),
              indProf: faker.random.alphaNumeric(10)
            },
            authToken: faker.random.alphaNumeric(10)
          };
          // Run test
          let testObj = lF.loadPortal(res);
          expect(testObj).to.be.a('promise');
          // Resolve/reject promise to avoid errors
          testObj.then(function(result){},function(err){});
        });
        // See 'Promise testing' for full functionality testing
      });
      
      describe('loadContentSuccess(res)', function() {
        it('Should be a function', function(){
          expect(lF.loadContentSuccess).to.be.a('function');
        });
        it('Should manipulate the DOM as expected', function() {
          // Create test DOM
          $('body').html(`
            <div class="content-wrapper login-wrapper"></div>
          `);
          // Create test response
          const res = faker.random.alphaNumeric(10);
          // Run test
          lF.loadContentSuccess(res);
          expect($('.content-wrapper').text()).to.equal(res);
          expect($('.content-wrapper').hasClass('login-wrapper')).to.equal(false);
          // Rest test DOM
          $('body').html('');
        });
      });
      
      describe('loadContentFailure', function() {
        it('Should be a function', function(){ 
          expect(lF.loadContentFailure).to.be.a('function');
        });
        it('Should manipulate the DOM as expected', function() {
          // Create test DOM
          $('body').html('');
          // Create test res object
          const res = {
            status: faker.random.alphaNumeric(10),
            responseText: faker.random.alphaNumeric(10)
          };
          // Run test
          lF.loadContentFailure(res);
          expect($('html').text()).to.equal(`${res.status}: ${res.responseText}`);
          // Reset test DOM
          $('body').html('');
        });
      });
      
      describe('createUser()', function() {
        it('Should be a function', function() {
          expect(lF.createUser).to.be.a('function');
        });
        it('Should return a promise (when form passwords match)', function() {
          // Create test DOM
          const testPassword = faker.random.alphaNumeric(10);
          $('body').html(`
            <form>
              <input name="username" val="${faker.random.alphaNumeric(10)}">
              <input name="password" val="${testPassword}">
              <input name="password-repeat" val="${testPassword}">
            </form>
          `);
          // Run test
          let testObj = lF.createUser();
          expect(testObj).to.be.a('promise');
          // Resolve/reject promise to avoid errors
          testObj.then(function(res){}, function(err){});
          // Reset test DOM
          $('body').html('');
          // See 'Promise testing' for full functionality testing
        });
      });
      
      describe('verifyPasswordMatch()', function() {
        it('Should be a function', function() {
          expect(lF.verifyPasswordMatch).to.be.a('function');
        });
        it('Should correctly check if two passwords match', function() {
          const testPW = faker.random.alphaNumeric(10);
          const testCases = [
           [testPW, testPW, true],
           [testPW, testPW+'X', false]
          ];
          testCases.forEach(function(testCase) {
            expect(lF.verifyPasswordMatch(testCase[0], testCase[1]))
              .to.equal(testCase[2]);
          });
        });
      });
      
      describe('createUserSuccess()', function() {
        it('Should be a function', function() {
          expect(lF.createUserSuccess).to.be.a('function');
        });
        it('Should manipulate the DOM as expected', function() {
        // Create test DOM
        $('body').html(`
           <div class="js-login-form create-account"></div>
           <div class="js-login-form-heading">Create Account</div>
           <input type="text" class="js-repeat-password"
                  name="password-repeat" style="display: block;" required></input>
           <input type="submit" value="Create Account" class="js-login-submit"></input>
           <a class="js-create-account-link">Log In</a>
           <div class="alert-area"></div>
        `);
        // Create test response object
        const res = {
          username: faker.random.alphaNumeric(10)
        }
        // Run test
        lF.createUserSuccess(res);
        expect($('.js-login-form').hasClass('create-account')).to.equal(false);
        expect($('.js-login-form-heading').text()).to.equal('Log In');
        expect($('.js-repeat-password').css('display')).to.equal('none');
        expect($('.js-repeat-password').prop('required')).to.equal(false);
        expect($('.js-login-submit').val()).to.equal('Log In');
        expect($('.js-create-account-link').text()).to.equal('Create Account');
        expect($('.alert-area').text()).to.equal(
          `User '${res.username}' created! You may now log in.`);
        // Reset test DOM
        $('body').html('');
        });
      });
      
      describe('createUserError', function() {
        it('Should be a function', function() {
          expect(lF.createUserError).to.be.a('function');
        });
        it('Should manipulate the DOM as expected', function() {
          // Create test DOM
          $('body').html(`<div class="alert-area"></div>`);
          // Create test response object
          const res = {
            responseJSON: {
              reason: faker.random.alphaNumeric(10),
              message: faker.random.alphaNumeric(10)
            }
          };
          // Run test
          lF.createUserError(res);
          expect($('.alert-area').text()).to.equal(
            `${res.responseJSON.reason}: ${res.responseJSON.message}`);
          // Reset test DOM
          $('body').html('');
        });
      });
    });
  });
});

