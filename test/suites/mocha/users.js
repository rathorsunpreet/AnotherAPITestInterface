const {
  request,
  expect,
  data,
  colors,
} = require('../../helpers/libs');

let response = '';
let userId = '';

const testName = `${colors.bgGreen('/users Endpoint - users file')}`;

describe(testName, function () {
  // GET Requests
  describe('GET', function () {
    context('List Check', function () {
      context('Valid Tests', function () {
        before(async function () {
          response = await request.get(`/api/users?page=${data.goodId}`);
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
          response = await request.get(`/api/users/${data.goodId}`);
        });
        it('Status Code is 200', function () {
          expect(response.status).to.eql(200);
        });
        it('Data Length is 5', function () {
          expect(Object.keys(response.body.data).length).to.eql(5);
        });
      });
      context('Invalid Tests', function () {
        before(async function () {
          response = await request.get(`/api/users/${data.badId}`);
        });
        it('Status Code is 404', function () {
          expect(response.status).to.eql(404);
        });
        it('Response Body is empty', function () {
          expect(Object.keys(response.body).length).to.eql(0);
        });
      });
    });
    context('Delayed Response', function () {
      // Increase timeout from default 2000ms in Mocha to new value
      this.timeout(3500);
      context('Valid Tests', function () {
        before(async function () {
          response = await request.get(`/api/users?delay=${data.delayedId}`);
        });
        it('Status Code is 200', function () {
          expect(response.status).to.eql(200);
        });
      });
    });
  });

  // POST Requests
  describe('POST', function () {
    context('Valid Tests', function () {
      before(async function () {
        response = await request.post('/api/users').send(data.usersPost);
      });
      it('Status Code is 201', function () {
        expect(response.status).to.eql(201);
        userId = response.body.id;
      });
    });
  });

  // PUT Requests
  describe('PUT', function () {
    context('Valid Tests', function () {
      before(async function () {
        response = await request.put(`/api/users/${userId}`).send(data.usersPut);
      });
      it('Status Code is 200', function () {
        expect(response.status).to.eql(200);
      });
    });
  });

  // PATCH Requests
  describe('PATCH', function () {
    context('Valid Tests', function () {
      before(async function () {
        response = await request.patch(`/api/users/${userId}`).send(data.usersPut);
      });
      it('Status Code is 200', function () {
        expect(response.status).to.eql(200);
      });
    });
  });

  // DELETE Requests
  describe('DELETE', function () {
    context('Valid Tests', function () {
      before(async function () {
        response = await request.delete(`/api/users/${userId}`);
      });
      it('Status Code is 204', function () {
        expect(response.status).to.eql(204);
      });
    });
  });
});
