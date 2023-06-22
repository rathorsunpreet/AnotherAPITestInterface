// Constants used in tests
// For production / prod environment
const data = {
  usersPost: {
    name: 'morpheus',
    job: 'leader',
  },
  usersPut: {
    name: 'morpheus',
    job: 'zion resident',
  },
  goodRegister: {
    email: 'eve.holt@reqres.in',
    password: 'pistol',
  },
  badRegister: {
    email: 'sydney@fife',
  },
  goodLogin: {
    email: 'eve.holt@reqres.in',
    password: 'cityslicka',
  },
  badLogin: {
    email: 'peter@klaven',
  },
  goodId: 2,
  badId: 23,
  delayedId: 3,
};

module.exports = data;
