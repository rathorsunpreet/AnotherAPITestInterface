const loader = require('./helpers/loader');

loader.loadDefaults('./test/config/defaults.json');

console.log(loader.getDefValue());
