const { state } = require('./helpers/state');
state.setupState(['env=dev', 'users', 'asshole', 'tiken=asdxcggg', 'excludefiles=resources, registration', 'login', 'all'])
console.dir(state);

//const loader = require('./helpers/loader');

//loader.loadDefaults('./test/config/defaults.json');
//console.log(loader.getDefValue());

//const aid = require('./helpers/aid');
//console.log(aid.getKey('excludefiles=asdc,asdf, asdasd'));
//console.log(aid.getValueArr('excludefiles=asdc,asdf, asdasd'));
