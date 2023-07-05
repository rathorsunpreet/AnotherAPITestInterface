const Mocha = require('mocha');
const path = require('path');

const cliRunner = new Mocha({
  exit: true,
  parallel: false,
  jobs: 1,
  ui: 'bdd',
  reporter: 'spec',
  spec: 'test/*.test.js',
});

const webRunner = new Mocha({
  reporter: 'mochawesome',
  spec: 'test/*.test.js',
  reporterOptions: {
    reportDir: 'HTML_Report',
    reportFilename: 'html_report',
    reportTitle: 'reqres Report',
    reportPageTitle: 'Reqres HTML Report',
    overwrite: true,
  },
});

// runnerType is boolean - true for webRunner, false for cliRunner
function addFileToReporter(runnerBool, fileArray, suitePath) {
  fileArray.forEach((file) => {
    if (!runnerBool) {
      cliRunner.addFile(path.join(suitePath, file));
    } else {
      webRunner.addFile(path.join(suitePath, file));
    }
  });
}

function executeFiles(runnerBool) {
  if (!runnerBool) {
    cliRunner.run(function (fails) {
      process.exitCode = fails ? 1 : 0;
      throw new Error('cliRunner failed execution!');
    });
  } else {
    webRunner.run(function (fails) {
      process.exitCode = fails ? 1 : 0;
      throw new Error('webRunner failed execution!');
    });
  }
}

module.exports = {
  addFileToReporter,
  executeFiles,
};
