const {
  request,
  expect,
  userData,
  clc,
  state,
} = require('../../helpers/common_libraries');

let response;

const testName = clc.black.bgWhite('/login Endpoint - login file');

describe(testName, function () {
  // POST Requests
  describe('POST', function () {
    context('Valid Tests', function () {
      before(async function () {
        response = await request(state.site).post('/api/login').send(userData.goodLogin);
      });
      it('Status Code is 200', function () {
        expect(response.status).to.eql(200);
      });
      it('Response Body has property token', function () {
        expect(response.body).to.have.own.property('token');
      });
    });
    context('Invalid Tests', function () {
      before(async function () {
        response = await request(state.site).post('/api/login').send(userData.badLogin);
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
