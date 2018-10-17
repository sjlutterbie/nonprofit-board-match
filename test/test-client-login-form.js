'use strict';

// Load testing packages
const chai = require('chai');

// Simplify expect functions
const expect = chai.expect;

// Create DOM testing environment
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const domBody = new JSDOM(
  `<!DOCTYPE html>
      <html>
        <body>
          <form class="js-test-form">
            <label class="js-test-label">Test label
              <input type="text" class="js-test-text">
            </label>
            <input type="submit" class="js-test-submit" value="Value">
          </form>
        </body>
      </html>`).window.document
  .querySelector('body');
  
describe('[Create Account | Log in] link', function() {
  
});