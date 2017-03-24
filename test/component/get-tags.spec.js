const test = require('tape');
const request = require('supertest');
const { app } = require('../../src/server');
const Service = require('../../src/db/service-model');
const clearDownServiceDB = () => Service.remove();
const serviceCreator = require('../../src/db/service-creator');
const jwt = require('jsonwebtoken');
const env = require('../../src/env-vars');
const Joi = require('joi');

test('get tags', (t) => {

  t.test('should return all tags', assert => {

    assert.plan(5);

    const fakeServiceA = {
      _id: 'my-fake-service-a',
      tags: [
        "fake-tag-1",
        "fake-tag-2"
      ],
      environments: [{
        _id: 'green-a',
        baseUrl: 'https://bob.com/a',
      }],
      links: [{
        _id: 'ping-a',
        url: '/ping-a'
      }],
    };

    const fakeServiceB = {
      _id: 'my-fake-service-b',
      tags: [
        "fake-tag-a"
      ],
      environments: [{
        _id: 'green-b',
        baseUrl: 'https://bob.com/b',
      }],
      links: [{
        _id: 'ping-b',
        url: '/ping-b'
      }],
    };

    clearDownServiceDB()
      .then(() => serviceCreator(fakeServiceA))
      .then(() => serviceCreator(fakeServiceB))
      .then(() => {
        request(app)
          .get('/service-registry/v1/tag')
          .end((err, res) => {
            assert.equal(res.status, 200, 'expected a success status code');
            assert.equal(res.body.length, 3);

            const results = res.body;

            assert.equal(results[0], "fake-tag-a", 'expected tag from database to match');
            assert.equal(results[1], "fake-tag-2", 'expected tag from database to match');
            assert.equal(results[2], "fake-tag-1", 'expected tag from database to match');
          });
      });

  });
});
