const {
  request,
  expect,
  data,
  colors,
} = require('../helpers/libs');

const testName = `${colors.bgGreen('/unknown Endpoint - multiple file')}`;

describe(testName, function () {
  // GET Requests
  describe('GET', function () {
    context('Single Check', function () {
      context('Invalid Tests - 15 times', function () {
        for (let i = 1; i < 16; i += 1) {
          let response = '';
          before(async function () {
            response = await request.get(`/api/unknown/${data.badId}`);
          });
          it('Response Body is empty', function (done) {
            expect(Object.keys(response.body).length).to.eql(0);
            done();
          });
        }
      });
    });
  });
});
