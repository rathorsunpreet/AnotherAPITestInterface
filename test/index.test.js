const colors = require('ansi-colors');
const { stateProxy } = require('./helpers/state');

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

if (stateProxy.argsCommandsUsed.valid.includes('help')) {
  stateProxy.showHelp();
  process.exit(0);
} else if (stateProxy.argsCommandsUsed.valid.includes('list')) {
  stateProxy.showList();
  process.exit(0);
} else if (stateProxy.argsCommandsUsed.valid.includes('savetemplate')) {
    stateProxy.saveTemplate();
} else if (stateProxy.argsCommandsUsed.valid.includes('templatename')) {
    stateProxy.setupTemplate();
} else {
  // Execute stateProxy.currentsuitelist array here
}

//console.dir(stateProxy);
