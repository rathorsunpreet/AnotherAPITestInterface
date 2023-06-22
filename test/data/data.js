// Exports the various _constants.js file based on NODE_ENV
const { state, defaults } = require('../helpers/state');

// Fallthrough on test allows default to use test
switch (state.env) {
  case defaults.env[0]: module.exports = require('./prod');
    console.log('Using prod environment');
    break;
  case defaults.env[1]:
    module.exports = require('./dev');
    console.log('Using dev environment');
    break;
  case defaults.env[2]: module.exports = require('./test');
    console.log('Using test environment');
    // fall through
  default: break;
}
