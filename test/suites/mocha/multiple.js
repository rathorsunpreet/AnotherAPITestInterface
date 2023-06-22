const {
  request,
  expect,
  userData,
  clc,
  state,
} = require('../../helpers/common_libraries');

const testName = clc.black.bgWhite('/unknown Endpoint - multiple file');

describe(testName, function () {
  // GET Requests
  describe('GET', function () {
    context('Single Check', function () {
      context('Invalid Tests - 15 times', function () {
        for (let i = 1; i < 16; i += 1) {
          let response;
          before(async function () {
            response = await request(state.site).get(`/api/unknown/${userData.badId}`);
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
