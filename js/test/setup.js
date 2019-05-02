// Global stuff for all tests here.
require('jsdom-global')()

// Mock for confirm function.
global.confirm = function () {
  return true
}

global.expect = require('expect')
global.sinon = require('sinon')
