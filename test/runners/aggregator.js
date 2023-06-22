const { state } = require('../helpers/state');
const mochaHandler = require('./mocha');

const reporter = mochaHandler.switchReporter;

function mochaLoadExecute() {
  mochaHandler.addFileList(state.getFilesFull());
  try {
    mochaHandler.runMocha();
  } catch (err) {
    console.error(`Error Encountered: ${err}`);
  }
}

module.exports = {
  reporter,
  mochaLoadExecute,
};
