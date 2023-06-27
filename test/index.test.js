const { stateObj } = require('./helpers/state');
//stateObj.setupState(['env=dev', 'users', 'asshole', 'excludefiles=registration,users', 'login' , 'templatename=omg', 'report']);
//stateObj.setupState(['templatename=omg']);
//stateObj.setupTemplate();
//console.dir(stateObj);
stateObj.saveTemplate();

//const loader = require('./helpers/loader');
//loader.loadDefaults('./test/config/defaults.json');
//console.log(loader.getCommDesc());

//const aid = require('./helpers/aid');
//console.log(aid.getKey('excludefiles=asdc,asdf, asdasd'));
//console.log(aid.getValueArr('excludefiles=asdc,asdf, asdasd'));
