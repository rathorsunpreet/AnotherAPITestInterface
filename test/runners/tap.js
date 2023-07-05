const path = require('path');
const spawn = require('cross-spawn');

let fileArray = [];
const tapList = [
  'npx',
  'tap',
  '--no-coverage',
  '--reporter=spec',
];

function addFileToReporter(fArray, suitePath) {
  fileArray = fArray.map((item) => path.join(suitePath, item));
}

function executeFiles() {
  if (fileArray.length !== 0) {
    const executeList = tapList.concat(fileArray);
    const baseComm = executeList.splice(0, 1);
    console.log(executeList);
    const child = spawn(baseComm, executeList, { stdio: 'inherit' });
  }
}

module.exports = {
  addFileToReporter,
  executeFiles,
};
