const { stateObj } = require('./helpers/state');
stateObj.setupState(['env=dev', 'users', 'asshole', 'tiken=asdxcggg', 'excludefiles=resources, registration', 'login'])
console.dir(stateObj);

//const loader = require('./helpers/loader');

//loader.loadDefaults('./test/config/defaults.json');
//console.log(loader.getDefValue());

//const aid = require('./helpers/aid');
//console.log(aid.getKey('excludefiles=asdc,asdf, asdasd'));
//console.log(aid.getValueArr('excludefiles=asdc,asdf, asdasd'));

// Add method in ui to split each string in the process.argv array into components if space is present
// For example:
// excludefiles=resources, registration becomes
// 'excludefiles=resource,' and 'registration'
