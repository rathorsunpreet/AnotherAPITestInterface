const colors = require('ansi-colors');
const { stateProxy } = require('./helpers/state');
const runners = require('./runners/runners');

if (process.argv.length === 2) {
  console.log('No arguments provided!');
  console.log(`Provide "${colors.yellow.bold('help')}" as an argument to get more details!`);
  process.exit(1);
}

// Remove node.exe
process.argv.shift();
// Remove npm run command
process.argv.shift();

// Turn all command-line arguments to lowercase
const cliArgs = process.argv.map((item) => item.toLowerCase());

stateProxy.setupState(cliArgs);

// Check commands in order
// help -> list -> display -> savetemplate -> templatename -> suite name(s)
if (stateProxy.argsCommandsUsed.valid.includes('help')) {
  stateProxy.showHelp();
  process.exit(0);
} else if (stateProxy.argsCommandsUsed.valid.includes('list')) {
  stateProxy.showList();
  process.exit(0);
} else if (stateProxy.argsCommandsUsed.valid.includes('display')) {
  stateProxy.displayDef();
  process.exit(0);
} else if (stateProxy.argsCommandsUsed.valid.includes('templatename')) {
  stateProxy.setupTemplate();
} else if (stateProxy.argsCommandsUsed.valid.includes('savetemplate')) {
  stateProxy.saveTemplate();
  process.exit(0);
}

// Display all invalids with appropriate message
if (stateProxy.excludefiles.invalid.length !== 0) {
  console.log('Following invalid test suite(s)/case(s) were provided with \'excludefiles\' command: ');
  console.log(stateProxy.excludefiles.invalid);
}
if (stateProxy.argsCommandsUsed.invalid.length !== 0) {
  console.log('Following invalid command(s)/suite(s)/case(s) provided as agruments: ');
  console.log(stateProxy.argsCommandsUsed.invalid);
}
if (stateProxy.tempCommandsUsed.invalid.length !== 0) {
  console.log(`${stateProxy.templatename} has the following invalid command(s)/suite(s)/case(s): `);
  console.log(stateProxy.tempCommandsUsed.invalid);
}
if (stateProxy.currentsuitelist.length !== 0) {
  // Execute stateProxy.currentsuitelist array here
  const runnerObj = {
    runner: stateProxy.runner,
    suiteList: stateProxy.currentsuitelist,
    suitePath: stateProxy.suitedir,
    report: false,
  };
  if (stateProxy.argsCommandsUsed.valid.includes('report')
  || stateProxy.tempCommandsUsed.valid.includes('report')) {
    runnerObj.report = true;
  }
  //console.log(stateProxy.suitedir);
  console.dir(runnerObj);
  runners.addFiles(runnerObj);
  runners.executeRunner(runnerObj.report, runnerObj.runner);
} else {
  console.log('No test suite(s)/case(s) provided!');
  process.exit(0);
}

//console.dir(stateProxy);
