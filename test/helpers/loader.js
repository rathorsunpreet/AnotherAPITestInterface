const fs = require('fs');
const path = require('path');
const js = require('json5');
const yml = require('yaml');
const Validator = require('jsonschema').Validator;

let defData = '';
let schemaData = '';
const checker = new Validator();

// Location and names of schema files
const schemaArr = [
  './test/schema/defaultsSchema.json',
  './test/schema/templateSchema.json,'
];

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

// Get all commands as an array
function getAllComm() {
  const comm = [];
  if (defData !== '') {
    defData.commads.withValue.forEach((item) => comm.push(item[0]));
    defData.commads.withoutValue.forEach((item) => comm.push(item[0]));
    return comm;
  }
  return defData;
}

// Get default values of certain commands
function getDefValue() {
  const comm = {};
  if (defData !== '') {
    defData.commands.withValue.forEach((item) => {
      if (item.length === 3) {
        comm[item[0]] = item[2];
      }
    });
    return comm;
  }
  return defData;
}

module.exports = {
  loadDefaults,
  getEnv,
  getRunner,
  getSites,
  getAllComm,
  getDefValue,
};
