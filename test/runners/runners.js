const mochaHandler = require('./mocha');

function addFiles(runnerObj) {
  switch (runnerObj.runner) {
    case 'mocha':
      mochaHandler.addFileToReporter(runnerObj.report, runnerObj.suiteList, runnerObj.suitePath);
      break;
    default: throw new Error('Object\'s runner property not set: runners.js/addFiles method!');
  }
}

function executeRunner(runnerBool, runnerType) {
  switch (runnerType) {
    case 'mocha':
      mochaHandler.executeFiles(runnerBool);
      break;
    default: throw new Error('runnerType not specified: runners.js/executeRunner method!');
  }
}

module.exports = {
  addFiles,
  executeRunner,
};
