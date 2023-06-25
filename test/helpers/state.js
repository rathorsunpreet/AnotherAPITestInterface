/* eslint no-param-reassign: off */
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
    // fill this.currentsuitelist with valid suite names
    const newSuite = newItem.filter((arg) => this.namedSuiteList.includes(arg));
    if (newSuite.length !== 0) {
      this.currentsuitelist = [...newSuite];
      this.commandsUsed.valid.push('currentsuitelist');
    }
    invalid = newItem.filter((arg) => !this.namedSuiteList.includes(arg));

    // Check for the keyword all
    // If all is present and there are more suites mentioned, remove those suites
    if (this.currentsuitelist.includes('all') && this.currentsuitelist.length !== 1) {
      this.currentsuitelist.length = 0;
      this.currentsuitelist.push('all');
    }

    // Iterate over invalid to check for valid commands
    // Perform necessary operations if valid commands
    invalid.forEach((arg) => {
      if (arg.includes('=')) {
        const key = getKey(arg);
        const valArr = getValueArr(arg);
        if (this.validCommList.includes(key)) {
          if (!Array.isArray(valArr) && valArr !== '') {
            this[key] = valArr.toString();
            this.commandsUsed.valid.push(arg);
          } else if (valArr.length !== 0){
            this[key] = [...valArr];
            this.commandsUsed.valid.push(arg);
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
  };

  this.setupTemplate = function () {
    const tempData = loadTemplate(path.join(this.templatedir, this.templatename));
    if (tempData !== '') {
      const propNames = Object.getOwnPropertyNames(tempData);
      propNames.forEach((id) => {
        if (id.localeCompare('commands') === 0) {
          Object.keys(tempData.commands).forEach((item) => {
            const kvPair = ''.concat(item, '=', tempData.commands[item]);
            if (propList.includes(item)) {
              if (!Array.isArray(tempData.commands[item]) && tempData.commands[item] !== '') {
                this[item] = tempData.commands[item];
                this.commandsUsed.valid.push(kvPair);
              } else if (tempData.commands[item].length !== 0) {
                let tempVal = tempData.commands[item];
                this[item] = [...tempVal];
                this.commandsUsed.valid.push(kvPair);
              }
            } else if (commWithoutValue.includes(item)) {
              if (tempData.commands[item] === true) {
                this.commandsUsed.valid.push(item);
              }
            } else {
              this.commandsUsed.invalid.push(kvPair);
            }
          });
        } else if (id.localeCompare('currentsuitelist') === 0 
            && tempData.currentsuitelist.length !== 0) {
          this.commandsUsed.valid.push('currentsuitelist');
          tempData.currentsuitelist.forEach((item) => {
            if (this.namedSuiteList.includes(item)) {
              if (item.localeCompare('all') === 0) {
                this.currentsuitelist = [...this.namedSuiteList];
              } else {
                this.currentsuitelist.push(item);
              }
            }
          });
        } else {
          const kv = ''.concat(id, '=', tempData[id]);
          this.commandsUsed.invalid.push(kv);
        }
      });
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
      // If templatename is set, then load template
      // and apply necessary operations
    } /*else if (prop.localeCompare('templatename') === 0) {
      target[prop] = value.slice(0);
      const tempData = loadTemplate(target[prop]);
      if (tempData !== '') {
        if (Object.prototype.hasOwnProperty.call(tempData, 'commands')) {
          tempData.commands.forEach((item) => {
            const kvPair = ''.concat(item, '=', tempData.commands[item]);
            if (propList.includes(item)) {
              target[prop] = tempData.commands[item];
              target.commandsUsed.valid.push(kvPair);
            } else if (commWithoutValue.includes(item)) {
              target.commandsUsed.valid.push(tempData.commands[item]);
            } else {
              target.commandsUsed.invalid.push(kvPair);
            }
          });
        } else if (Object.prototype.hasOwnProperty.call(tempData, 'currentsuitelist')) {
          tempData.currentsuitelist.forEach((item) => {
            if (target.namedSuiteList.includes(item)) {
              if (item.localeCompare('all') === 0) {
                target.currentsuitelist = [...target.namedSuiteList];
              } else {
                target.currentsuitelist.push(item);
              }
            }
          });
          if (target.currentsuitelist.length !== 0) {
            target.commandsUsed.valid.push('currentsuitelist');
          }
        } else {
          const propNames = Object.getOwnPropertyNames(tempData);
          const commIndex = propNames.indexOf('commands');
          const suiteIndex = propNames.indexOf('currentsuitelist');
          // Remove commands and currentsuitelist
          if (commIndex !== -1) {
            propNames.splice(commIndex, 1);
          }
          if (suiteIndex !== -1) {
            propNames.splice(suiteIndex, 1);
          }
          propNames.forEach((item) => {
            const kv = ''.concat(item, '=', tempData[item]);
            target.commandsUsed.invalid.push(kv);
          });
        }
      }
      return true;
    } */else if (Object.prototype.hasOwnProperty.call(target, prop)) {
      return Reflect.set(target, prop, value);
    } else {
      return new Error(`${prop} property of ${target} used!`);
    }
  },
};

// const state = new Proxy(stateObj, handler)

module.exports = {
  stateObj,
};
