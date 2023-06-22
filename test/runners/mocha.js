// Contains the mocha runner
const Mocha = require('mocha');

// Helps decide which reporter to use
// true for web, false for general
let whichReporter = false;

// Mocha config for running terminal tests
const generalReporter = new Mocha({
  exit: true,
  parallel: false,
  jobs: 1,
  ui: 'bdd',
  reporter: 'spec',
  spec: 'test/*.test.js',
});

// Mocha config for generating HTML report via mochawesome
const webReporter = new Mocha({
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

function switchReporter(value) {
  whichReporter = value;
}

function addFileList(fileArray) {
  fileArray.forEach(function (file) {
    if (whichReporter) {
      webReporter.addFile(file);
    } else {
      generalReporter.addFile(file);
    }
  });
}

function runMocha() {
  if (whichReporter) {
    webReporter.run(function (fails) {
      // Set Exit Code 1 for failure, 0 for success
      process.exitCode = fails ? 1 : 0;
      throw new Error('runMocha webReporter.run function failed');
    });
  } else {
    generalReporter.run(function (fails) {
      // Set Exit Code 1 for failure, 0 for success
      process.exitCode = fails ? 1 : 0;
      throw new Error('runMocha generalReporter.run function failed');
    });
  }
}

module.exports = {
  switchReporter,
  addFileList,
  runMocha,
};
