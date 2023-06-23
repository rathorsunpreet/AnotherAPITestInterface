const fs = require('fs');
const path = require('path');
const js = require('json5');
const yml = require('yaml');

let defData = '';

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
    try {
      defData = js.parse(fs.readFileSync(fname, 'utf8'));
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

module.exports = {
  loadDefaults,
  getEnv,
  getRunner,
  getSites,
};
