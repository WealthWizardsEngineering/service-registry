const test = require('tape');
const request = require('supertest');

const { app } = require('../../src/server');

test('health wired in', assert => {

  assert.plan(2);

  request(app)
    .get('/service-registry/health')
    .expect(200)
    .end((err, res) => {
      assert.equal(res.body.resources[0].name, "service store", 'unexpected name');
      assert.equal(res.body.resources[0].status, "HEALTHY", 'service is no healthy');
    });
});
