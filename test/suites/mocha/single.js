const {
  request,
  expect,
  data,
  colors,
} = require('../../helpers/libs');

let response = '';

const suiteName = `${colors.bgGreen('/login Endpoint - single file')}`;

describe(suiteName, function () {
  // POST Requests
  describe('POST', function () {
    context('Valid Tests', function () {
      before(async function () {
        response = await request.post('/api/login').send(data.goodLogin);
      });
      it('Status Code is 200', function () {
        expect(response.status).to.eql(200);
      });
    });
  });
});
