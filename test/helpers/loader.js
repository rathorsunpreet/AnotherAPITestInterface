const fs = require('fs');
const path = require('path');
const js = require('json5');
const { Validator } = require('jsonschema');

let defData = '';
let schemaData = '';
const checker = new Validator();

// Location of schema files
const schemaPath = './test/schema/';
// Schema files
const schemaArr = fs.readdirSync(schemaPath)
  .filter((item) => path.extname(item).localeCompare('.json') === 0)
  .map((item) => path.join(schemaPath, item));

// which is boolean
// true for defaults, false for templates
function loadSchema(which) {
  try {
    if (which) {
      schemaData = js.parse(fs.readFileSync(schemaArr[0], 'utf8'));
    } else {
      schemaData = js.parse(fs.readFileSync(schemaArr[1], 'utf8'));
    }
  } catch (err) {
    console.error(err);
  }
}

// Method to check if file exists
function checkIfExists(fname) {
  if (fs.existsSync(fname)) {
    return true;
  }
  return false;
}

// Returns parsed template as an object
function loadTemplate(fname) {
  let tempData = '';
  let filename = '';
  // Attach .json extension if none is provided
  if (path.extname(fname) === '') {
    filename = ''.concat(fname, '.json');
  } else {
    filename = fname.slice(0);
  }
  if (checkIfExists(filename)) {
    loadSchema(false);
    try {
      tempData = js.parse(fs.readFileSync(filename, 'utf8'));
      if (!checker.validate(tempData, schemaData).valid) {
        console.error(`Template ${fname} has incorrect format / value!`);
        tempData = '';
      }
    } catch (err) {
      console.error(err);
    }
  }
  return tempData;
}

// Method to load defaults.json
// Call this method first, otherwise subsequents methods would return empty string
function loadDefaults(fname) {
  if (checkIfExists(fname)) {
    loadSchema(true);
    try {
      defData = js.parse(fs.readFileSync(fname, 'utf8'));
      // If defaults.json does not match schema, defData is set to empty
      if (!checker.validate(defData, schemaData).valid) {
        console.error('defaults.json file has incorrect format / value!');
        defData = '';
      }
    } catch (err) {
      console.error(err);
    }
  }
}

// Method to get env from defaults.json
function getEnv() {
  if (defData !== '') {
    return defData.env;
  }
  return defData;
}

// Method to get runner from defaults.json
function getRunner() {
  if (defData !== '') {
    return defData.runner;
  }
  return defData;
}

// Method to get sites from defaults.json
function getSites() {
  if (defData !== '') {
    return defData.sites;
  }
  return defData;
}

function getCommWithValue() {
  const comm = [];
  if (defData !== '') {
    defData.commands.withValue.forEach((item) => comm.push(item[0]));
    return comm;
  }
  return defData;
}

function getCommWithoutValue() {
  const comm = [];
  if (defData !== '') {
    defData.commands.withoutValue.forEach((item) => comm.push(item[0]));
    return comm;
  }
  return defData;
}

// Get all commands as an array
function getAllComm() {
  if (defData !== '') {
    return getCommWithValue().concat(getCommWithoutValue());
  }
  return defData;
}

// Get default values of certain commands
function getDefValue() {
  const comm = {};
  if (defData !== '') {
    defData.commands.withValue.forEach((item) => {
      if (item.length === 3) {
        const [name, , val] = item;
        comm[name] = val;
      }
    });
    return comm;
  }
  return defData;
}

// Returns object with command-description pair
function getCommDesc() {
  const cdPair = {};
  if (defData !== '') {
    defData.commands.withValue.forEach((item) => {
      const [name, desc] = item;
      cdPair[name] = desc;
    });
    defData.commands.withoutValue.forEach((item) => {
      const [name, desc] = item;
      cdPair[name] = desc;
    });
    return cdPair;
  }
  return defData;
}

function writeFile(obj, location, name) {
  let newName = '';
  if (name === '') {
    const dnow = Math.floor(Date.now() / 1000);
    newName = obj.commands.env.concat('_', dnow, '.json');
  } else {
    newName = name;
  }
  const newLocation = ''.concat(location, newName);
  try {
    fs.writeFileSync(newLocation, JSON.stringify(obj, null, 2), 'utf8');
    console.log(`Template has been saved as ${newLocation}`);
  } catch (err) {
    console.error(err);
  }
}

function getOtherProps() {
  if (defData !== '') {
    const offList = Object.keys(defData).filter((item) => item.localeCompare('commands') !== 0);
    return offList;
  }
  return defData;
}

module.exports = {
  loadTemplate,
  loadDefaults,
  getEnv,
  getRunner,
  getSites,
  getCommWithValue,
  getCommWithoutValue,
  getAllComm,
  getDefValue,
  getCommDesc,
  writeFile,
  getOtherProps,
};
