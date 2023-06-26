/* eslint no-param-reassign: off, max-len: ["error", { "code": 120 }] */
const fs = require('fs');
const path = require('path');
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
  // Commands used in this run
  this.commandsUsed = {
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

  // Method to display all available suites, also includes the keyword 'all'
  this.showList = function () {
    const newList = [...this.namedSuiteList];
    newList.push('all');
    console.log(newList);
  };

  // Method to setup state
  // item can be array (coming from arguments ui) or
  // an object (coming from templates ui)
  this.setupState = function (item) {
    // Array to hold all non-suite names
    // These could be valid or invalid commands
    let invalid = [];
    // Remove all starting and ending spaces
    const newItem = item.map((arg) => arg.trim());
    // fill this.currentsuitelist with valid suite names
    const newSuite = [];
    newItem.forEach((suite) => {
      if (suite.localeCompare('all') === 0) {
        this.currentsuitelist = [...this.namedSuiteList];
      } else if (this.namedSuiteList.includes(suite) && !this.currentsuitelist.includes(suite)) {
        this.currentsuitelist.push(suite);
      }
    });

    if (newSuite.length !== 0) {
      this.currentsuitelist = [...newSuite];
      this.commandsUsed.valid.push('currentsuitelist');
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
            this.commandsUsed.valid.push(key);
          } else if (valArr.length !== 0) {
            if (key.localeCompare('excludefiles') === 0) {
              this.excludefiles.valid = valArr.filter((sname) => this.namedSuiteList.includes(sname));
              this.excludefiles.invalid = valArr.filter((sname) => !this.namedSuiteList.includes(sname));
            } else {
              this[key] = [...valArr];
            }
            this.commandsUsed.valid.push(key);
          }
        } else {
          this.commandsUsed.invalid.push(arg);
        }
      } else if (this.validCommList.includes(arg)) {
        this.commandsUsed.valid.push(arg);
      } else {
        this.commandsUsed.invalid.push(arg);
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
          Object.keys(tempData.commands).forEach((item) => {
            const kvPair = ''.concat(item, '=', tempData.commands[item]);
            if (propList.includes(item)) {
              if (!this.commandsUsed.valid.includes(item)) {
                if (!Array.isArray(tempData.commands[item]) && tempData.commands[item] !== '') {
                  this[item] = tempData.commands[item];
                  this.commandsUsed.valid.push(item);
                } else if (tempData.commands[item].length !== 0) {
                  const tempVal = tempData.commands[item];
                  if (item.localeCompare('excludefiles') === 0) {
                    this.excludefiles.valid = tempVal.filter((sname) => this.namedSuiteList.includes(sname));
                    this.excludefiles.invalid = tempVal.filter((sname) => !this.namedSuiteList.includes(sname));
                  } else {
                    this[item] = [...tempVal];
                  }
                  this.commandsUsed.valid.push(item);
                }
              }
            } else if (commWithoutValue.includes(item)) {
              if (tempData.commands[item] === true && !this.commandsUsed.valid.includes(item)) {
                this.commandsUsed.valid.push(item);
              }
            } else {
              this.commandsUsed.invalid.push(kvPair);
            }
          });
        } else if (id.localeCompare('currentsuitelist') === 0
            && tempData.currentsuitelist.length !== 0) {
          if (!this.commandsUsed.valid.includes('currentsuitelist')) {
            this.commandsUsed.valid.push('currentsuitelist');
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
          this.commandsUsed.invalid.push(kv);
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
    } else if (Object.prototype.hasOwnProperty.call(target, prop)) {
      return Reflect.set(target, prop, value);
    }
    return new Error(`${prop} property of ${target} used!`);
  },
};

// const stateProxy = new Proxy(stateObj, handler)

module.exports = {
  stateObj,
};
