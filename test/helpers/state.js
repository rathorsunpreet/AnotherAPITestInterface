const fs = require('fs');
const path = require('path');
const {
  loadDefaults,
  getCommWithValue,
  getDefValue,
  getSites,
  getAllComm,
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
const sites = getSites();

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
  this.site = sites[this.env];
  // Make excludefiles an object
  this.excludefiles = {
    valid: [],
    invalid: [],
  };
  // Make currentSuiteList an array instead
  this.currentSuiteList = [];
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
  // Add keyword all to namedSuiteList
  this.namedSuiteList.push('all');

  // Method to setup state
  // item can be array (coming from arguments ui) or
  // an object (coming from templates ui)
  this.setupState = function (item) {
    // Array to hold all non-suite names
    // These could be valid or invalid commands
    let invalid = [];
    // Remove all starting and ending spaces
    const newItem = item.map((arg) => arg.trim());
    // fill this.currentSuiteList with valid suite names
    this.currentSuiteList = newItem.filter((arg) => this.namedSuiteList.includes(arg));
    invalid = newItem.filter((arg) => !this.namedSuiteList.includes(arg));

    // Check for the keyword all
    // If all is present and there are more suites mentioned, remove those suites
    if (this.currentSuiteList.includes('all') && this.currentSuiteList.length !== 1) {
      this.currentSuiteList.length = 0;
      this.currentSuiteList.push('all');
    }

    // Iterate over invalid to check for valid commands
    // Perform necessary operations if valid commands
    invalid.forEach((arg) => {
      if (arg.includes('=')) {
        const key = getKey(arg);
        const valArr = getValueArr(arg);
        if (this.validCommList.includes(key)) {
          if (!Array.isArray(valArr)) {
            this[key] = valArr.toString();
          } else {
            this[key] = [...valArr];
          }
          this.commandsUsed.valid.push(arg);
        } else {
          this.commandsUsed.invalid.push(arg);
        }
      } else if (this.validCommList.includes(arg)) {
        this.commandsUsed.valid.push(arg);
      } else {
        this.commandsUsed.invalid.push(arg);
      }
    });
  };
};

const stateObj = new State();

module.exports = {
  stateObj,
};
