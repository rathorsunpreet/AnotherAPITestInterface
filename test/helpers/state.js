const { loadDefaults } = require('./loader');

// defaults command array
const defComm = [
  'defaults',
  'Specify which JSON file to use as default',
  './test/config/defaults.json',
];

loadDefaults(defComm[2]);

function State() {
  
}
