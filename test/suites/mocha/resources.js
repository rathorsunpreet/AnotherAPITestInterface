const {
  request,
  expect,
  data,
  colors,
} = require('../../helpers/libs');

let response = '';

const testName = `${colors.bgGreen('/unknown Endpoint - resources file')}`;

describe(testName, function () {
  // GET Requests
  describe('GET', function () {
    context('List Check', function () {
      context('Valid Tests', function () {
        before(async function () {
          response = await request.get('/api/unknown');
        });
        it('Status Code is 200', function () {
          expect(response.status).to.eql(200);
        });
        it('Data Length is 6', function () {
          expect(response.body.data.length).to.eql(6);
        });
      });
      // Add any invalid test here for List Check
    });
    context('Single Check', function () {
      context('Valid Tests', function () {
        before(async function () {
          response = await request.get(`/api/uknown/${data.goodId}`);
        });
        it('Status Code is 200', function () {
          expect(response.status).to.eql(200);
        });
      });
      context('Invalid Tests', function () {
        before(async function () {
          response = await request.get(`/api/unknown/${data.badId}`);
        });
        it('Status Code is 404', function () {
          expect(response.status).to.eql(404);
        });
        it('Response Body is empty', function () {
          expect(Object.keys(response.body).length).to.eql(0);
        });
      });
    });
  });
});
