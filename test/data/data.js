// Exports the various _constants.js file based on NODE_ENV
const { stateProxy } = require('../helpers/state');

const envList = stateProxy.getDef('env');
// Fallthrough on test allows default to use test
switch (stateProxy.env) {
  case envList[0]: module.exports = require('./prod');
    console.log('Using prod environment');
    break;
  case envList[1]:
    module.exports = require('./dev');
    console.log('Using dev environment');
    break;
  case envList[2]: module.exports = require('./test');
    console.log('Using test environment');
    // fall through
  default: break;
}
