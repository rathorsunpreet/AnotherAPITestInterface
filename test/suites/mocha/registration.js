const {
  request,
  expect,
  data,
  colors,
} = require('../../helpers/libs');

let response = '';

const testName = `${colors.bgGreen('/register Endpoint - registration file')}`;

describe(testName, function () {
  // POST Requests
  describe('POST', function () {
    context('Valid Tests', function () {
      before(async function () {
        response = await request.post('/api/register').send(data.goodRegister);
      });
      it('Status Code is 200', function () {
        expect(response.status).to.eql(200);
      });
      it('Response Body has property id', function () {
        expect(response.body).to.have.own.property('id');
      });
      it('Response Body has property token', function () {
        expect(response.body).to.have.own.property('token');
      });
    });
    context('Invalid Tests', function () {
      before(async function () {
        response = await request.post('/api/register').send(data.badRegister);
      });
      it('Status Code is 400', function () {
        expect(response.status).to.eql(400);
      });
      it('Response Body has property error', function () {
        expect(response.body).to.have.own.property('error');
      });
    });
  });
});
