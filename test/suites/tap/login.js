const {
  request,
  expect,
  data,
  colors,
} = require('../../helpers/libs');

let response = '';

const testName = `${colors.bgGreen('/login Endpoint - login file')}`;

tap.test(testName, (child) => {
  child.test('Valid tests', async (subchild) => {
    response = await request.post('/api/login').send({ email: 'eve.holt@reqres.in', password: 'cityslicka' });
    subchild.equal(response.status, 200, 'Response status is 200');
    subchild.hasProp(response.body, 'token', 'Response Body has property named token');
    subchild.end();
  });
  child.test('Invalid tests', async (subchild) => {
    response = await request.post('/api/login').send({ email: 'peter@klaven' });
    subchild.equal(response.status, 400, 'Response status is 400');
    subchild.hasProp(response.body, 'error', 'Response Body has property named error');
    subchild.end();
  });
  child.end();
});
