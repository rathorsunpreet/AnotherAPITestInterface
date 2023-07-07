/* eslint no-param-reassign: off, max-len: ["error", { "code": 150 }] */
const fs = require('fs');
const path = require('path');
const figlet = require('figlet');
const colors = require('ansi-colors');
const columinfy = require('columnify');
const {
  loadDefaults,
  getCommWithValue,
  getDefValue,
  getSites,
  getAllComm,
  getEnv,
  getRunner,
  loadTemplate,
  getCommWithoutValue,
  getCommDesc,
  writeFile,
  getOtherProps,
} = require('./loader');
const {
  getKey,
  getValueArr,
} = require('./aid');

// defaults command array
const defComm = [
  'defaults',
  'Specify which JSON file to use as default',
  './test/config/defaults.json',
];

loadDefaults(defComm[2]);
const propList = getCommWithValue();
const defValue = getDefValue();
const sitesObj = getSites();
const envList = getEnv();
const runnerList = getRunner();
const commWithoutValue = getCommWithoutValue();
const displayDefValues = getOtherProps();

if (propList === '') {
  console.error(`defaults.json was not read at '${defComm[2]}'!`);
  throw new Error('defaults.json not found!');
}

const State = function () {
  propList.forEach((prop) => {
    if (Object.prototype.hasOwnProperty.call(defValue, prop)) {
      this[prop] = defValue[prop];
    } else {
      this[prop] = '';
    }
  });
  // Setup site based on env
  this.site = sitesObj[this.env];
  // Make excludefiles an object
  this.excludefiles = {
    valid: [],
    invalid: [],
  };
  // Make currentsuitelist an array instead
  this.currentsuitelist = [];
  // Add additional properties
  // Commands used in this run supplied as arguments
  this.argsCommandsUsed = {
    valid: [],
    invalid: [],
  };
  // Commands used when performing read on a template file
  this.tempCommandsUsed = {
    valid: [],
    invalid: [],
  };
  // List of all valid commands
  this.validCommList = getAllComm();
  // List of suites available with the extension
  this.fullSuiteList = fs.readdirSync(this.suitedir)
    .filter((item) => path.extname(item).localeCompare('.js') === 0);
  // List of suites available without the extension
  this.namedSuiteList = [];
  this.fullSuiteList.forEach((item) => {
    this.namedSuiteList.push(path.parse(item).name);
  });

  // Method to get full file name including the extension
  this.getFullSuite = function () {
    return this.currentsuitelist.map((item) => ''.concat(item, '.js'));
  };

  // Method to display default.json's values for env, runner and site
  this.displayDef = function () {
    switch (this.display) {
      case displayDefValues[0]:
        console.log('The available environments are: ');
        console.log(envList);
        break;
      case displayDefValues[1]:
        console.log('The available runners are: ');
        console.log(runnerList);
        break;
      case displayDefValues[2]:
        console.log('The available sites (env:site) are: ');
        console.dir(sitesObj);
        break;
      default: throw new Error('No valid parameters provided!');
    }
  };

  // Method to get non-command object values from defaults.json
  this.getDef = function (param) {
    if (displayDefValues.includes(param)) {
      switch (param) {
        case displayDefValues[0]: return envList;
        case displayDefValues[1]: return runnerList;
        case displayDefValues[2]: return sitesObj;
        default: throw new Error('No valid parameters provided!');
      }
    }
    return '';
  };

  // Method to display all available suites, also includes the keyword 'all'
  this.showList = function () {
    const newList = [...this.namedSuiteList];
    newList.push('all');
    console.log(newList);
  };

  // Help message
  this.showHelp = function () {
    const cdPair = getCommDesc();
    // Add compound commands
    cdPair['env=site'] = 'Compound command which executes "env" and "site" in consecutive order';
    const columns = columinfy(cdPair, { showHeaders: false });
    console.log(figlet.textSync('Another API Test Interface', {
      font: 'Cybermedium',
      horizontalLayout: 'default',
      verticalLayout: 'default',
      width: 180,
      whitespaceBreak: true,
    }));
    console.log('This is a successor to Simple API Test Interface.');
    console.log('');
    console.log(`${colors.yellow.bold('Usage')}: `);
    console.log(`${colors.red.bold('npm run test command/suite name(s)')}`);
    console.log('This executes the mentioned command or suite(s) provided they are valid.');
    console.log(`Use the word "${colors.red.bold('all')}" to execute all test suites.`);
    console.log('');
    console.log(`Mocha Test suites/cases need to be put into "${colors.red.bold(this.suitedir)}" for the system to detect them.`);
    console.log(`If site needs to be updated, then change it in "${colors.red.bold(defComm[2])}".`);
    console.log('Only javascript files are detected.');
    console.log('');
    console.log('The following commands are available: ');
    console.log(columns);
    console.log('');
    console.log(`${colors.yellow.bold('Notes')}:`);
    console.log('1. Command-line arguments take precedence over the same commands provided by a template.');
    console.log(`2. Command ${colors.yellow('templatename')} could be used without a value and the system will make one.`);
  };

  this.saveTemplate = function () {
    const temp = {
      commands: {},
    };
    const unneededProps = [
      'argsCommandsUsed',
      'tempCommandsUsed',
      'templatename',
      'display',
      'validCommList',
      'fullSuiteList',
      'namedSuiteList',
    ];
    const nonMethodProps = Object.getOwnPropertyNames(this).filter((item) => typeof this[item] !== 'function');
    nonMethodProps.forEach((item) => {
      if (item.localeCompare('excludefiles') === 0) {
        temp.commands[item] = this[item].valid;
      } else if (item.localeCompare('currentSuiteList') === 0) {
        temp[item] = this[item];
      } else if (!unneededProps.includes(item)) {
        temp.commands[item] = this[item];
      }
    });
    // Check if templatename has no extension
    if (path.extname(this.templatename) === '') {
      this.templatename = ''.concat(this.templatename, '.json');
    }
    writeFile(temp, temp.commands.templatedir, this.templatename);
  };

  // Method to setup state
  this.setupState = function (item) {
    // Array to hold all non-suite names
    // These could be valid or invalid commands
    let invalid = [];
    // Remove all starting and ending spaces
    const newItem = item.map((arg) => arg.trim());
    // fill this.currentsuitelist with valid suite names
    newItem.forEach((suite) => {
      if (suite.localeCompare('all') === 0) {
        this.currentsuitelist = [...this.namedSuiteList];
      } else if (this.namedSuiteList.includes(suite) && !this.currentsuitelist.includes(suite)) {
        this.currentsuitelist.push(suite);
      }
    });

    if (this.currentsuitelist.length !== 0) {
      this.argsCommandsUsed.valid.push('currentsuitelist');
    }
    invalid = newItem.filter((arg) => !this.namedSuiteList.includes(arg));
    // Remove all from invalid
    if (invalid.includes('all')) {
      const allIndex = invalid.indexOf('all');
      invalid.splice(allIndex, 1);
    }

    // Iterate over invalid to check for valid commands
    // Perform necessary operations if valid commands
    invalid.forEach((arg) => {
      // Check if the command has an = sign
      if (arg.includes('=')) {
        const key = getKey(arg);
        const valArr = getValueArr(arg);
        if (this.validCommList.includes(key)) {
          if (!Array.isArray(valArr) && valArr !== '') {
            if (key.localeCompare('excludefiles') === 0) {
              if (this.namedSuiteList.includes(valArr)) {
                this.excludefiles.valid = [valArr];
              } else {
                this.excludefiles.invalid = [valArr];
              }
            } else {
              this[key] = valArr.toString();
            }
            if (!this.argsCommandsUsed.valid.includes(key)) {
              this.argsCommandsUsed.valid.push(key);
            }
          } else if (valArr.length !== 0) {
            if (key.localeCompare('excludefiles') === 0) {
              this.excludefiles.valid = valArr.filter((sname) => this.namedSuiteList.includes(sname));
              this.excludefiles.invalid = valArr.filter((sname) => !this.namedSuiteList.includes(sname));
            } else {
              this[key] = [...valArr];
            }
            if (!this.argsCommandsUsed.valid.includes(key)) {
              this.argsCommandsUsed.valid.push(key);
            }
          }
          // Command is a compund command of type env=site
          // For example: dev=newsite
          // This breaks down into the following commands:
          // 1. env=dev
          // 2. site=newsite
        } else if (envList.includes(key)) {
          this.env = key;
          this.site = valArr;
          if (!this.argsCommandsUsed.valid.includes('env')) {
            this.argsCommandsUsed.valid.push('env');
          }
          if (!this.argsCommandsUsed.valid.includes('site')) {
            this.argsCommandsUsed.valid.push('site');
          }
        } else {
          this.argsCommandsUsed.invalid.push(arg);
        }
        // Command is without an = sign
      } else if (this.validCommList.includes(arg)) {
        if (!this.argsCommandsUsed.valid.includes(arg)) {
          this.argsCommandsUsed.valid.push(arg);
        }
      } else {
        this.argsCommandsUsed.invalid.push(arg);
      }
    });
    // Remove suites mentioned in excludefiles.valid from currentsuitelist
    if (this.excludefiles.valid.length !== 0) {
      this.currentsuitelist = this.currentsuitelist.filter((suite) => !this.excludefiles.valid.includes(suite));
    }
  };

  // Only call this when both of the following conditions are met:
  // 1. setupState was called first
  // 2. command 'templatename=somename' was used
  this.setupTemplate = function () {
    const tempData = loadTemplate(path.join(this.templatedir, this.templatename));
    if (tempData !== '') {
      const propNames = Object.getOwnPropertyNames(tempData);
      propNames.forEach((id) => {
        if (id.localeCompare('commands') === 0) {
          // Iterate over tempData.commands block
          // If valid commands then perform necessary operations
          Object.keys(tempData.commands).forEach((item) => {
            const kvPair = ''.concat(item, '=', tempData.commands[item]);
            // console.log(kvPair + ':' + !this.argsCommandsUsed.valid.includes(item));
            if (!this.argsCommandsUsed.valid.includes(item)) {
              if (propList.includes(item)) {
                if (!Array.isArray(tempData.commands[item]) && tempData.commands[item] !== '') {
                  // console.log(kvPair);
                  this[item] = tempData.commands[item];
                  if (!this.tempCommandsUsed.valid.includes(item)) {
                    this.tempCommandsUsed.valid.push(item);
                  }
                } else if (tempData.commands[item].length !== 0) {
                  const tempVal = tempData.commands[item];
                  if (item.localeCompare('excludefiles') === 0) {
                    this.excludefiles.valid = tempVal.filter((sname) => this.namedSuiteList.includes(sname));
                    this.excludefiles.invalid = tempVal.filter((sname) => !this.namedSuiteList.includes(sname));
                  } else {
                    this[item] = [...tempVal];
                  }
                  if (!this.tempCommandsUsed.valid.includes(item)) {
                    this.tempCommandsUsed.valid.push(item);
                  }
                }
              } else if (commWithoutValue.includes(item)) {
                if (tempData.commands[item] === true && !this.tempCommandsUsed.valid.includes(item)) {
                  this.tempCommandsUsed.valid.push(item);
                }
                // Handle dev=newsite command
              } else if (envList.includes(item) && !this.argsCommandsUsed.valid.includes('env')) {
                this.env = item;
                this.site = tempData.commands[item];
                if (!this.tempCommandsUsed.valid.includes('env')) {
                  this.tempCommandsUsed.valid.push('env');
                }
                if (!this.tempCommandsUsed.valid.includes(tempData.commands[item])) {
                  this.tempCommandsUsed.valid.push('site');
                }
              } else {
                this.tempCommandsUsed.invalid.push(kvPair);
              }
            }
          });
        } else if (id.localeCompare('currentsuitelist') === 0
            && tempData.currentsuitelist.length !== 0) {
          if (!this.tempCommandsUsed.valid.includes('currentsuitelist')
            && !this.argsCommandsUsed.valid.includes('currentsuitelist')) {
            this.tempCommandsUsed.valid.push('currentsuitelist');
            tempData.currentsuitelist.forEach((item) => {
              if (item.localeCompare('all') === 0) {
                this.currentsuitelist = [...this.namedSuiteList];
              } else if (this.namedSuiteList.includes(item) && !this.currentsuitelist.includes(item)) {
                this.currentsuitelist.push(item);
              }
            });
          }
        } else {
          const kv = ''.concat(id, '=', tempData[id]);
          this.tempCommandsUsed.invalid.push(kv);
        }
      });
      // Remove suites mentioned in excludefiles.valid from currentsuitelist
      if (this.excludefiles.valid.length !== 0) {
        this.currentsuitelist = this.currentsuitelist.filter((suite) => !this.excludefiles.valid.includes(suite));
      }
    }
  };
};

const stateObj = new State();

const handler = {
  set(target, prop, value) {
    // Check env if it is valid
    if (prop.localeCompare('env') === 0) {
      if (envList.includes(value)) {
        // Update site if env is valid
        target.site = sitesObj[value];
        return Reflect.set(target, prop, value);
      }
      // Check runner if it is valid
    } else if (prop.localeCompare('runner') === 0) {
      if (runnerList.includes(value)) {
        // Update suitedir if runner is valid
        target.suitedir = path.join(target.suitedir, '../', value, '/');
        return Reflect.set(target, prop, value);
      }
    } else if (prop.localeCompare('display') === 0) {
      if (displayDefValues.includes(value)) {
        return Reflect.set(target, prop, value);
      }
    } else if (Object.prototype.hasOwnProperty.call(target, prop)) {
      return Reflect.set(target, prop, value);
    }
    return new Error(`${prop} property of ${target} used!`);
  },
};

const stateProxy = new Proxy(stateObj, handler);

module.exports = {
  stateProxy,
};
