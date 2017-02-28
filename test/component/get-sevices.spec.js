const test = require('tape');
const request = require('supertest');
const { app } = require('../../src/server');
const Service = require('../../src/db/service-model');
const clearDownServiceDB = () => Service.remove();
const serviceCreator = require('../../src/db/service-creator');
const jwt = require('jsonwebtoken');
const env = require('../../src/env-vars');
const Joi = require('joi');

test('get services', (t) => {

  t.test('should return all application versions sorted by date desc', assert => {

    assert.plan(16);

    const fakeServiceA = {
      _id: 'my-fake-service-a',
      environments: [{
        name: 'green-a',
        baseUrl: 'https://bob.com/a',
      }],
      links: [{
        name: 'ping-a',
        url: '/ping-a'
      }],
    };

    const fakeServiceB = {
      _id: 'my-fake-service-b',
      environments: [{
        name: 'green-b',
        baseUrl: 'https://bob.com/b',
      }],
      links: [{
        name: 'ping-b',
        url: '/ping-b'
      }],
    };

    clearDownServiceDB()
      .then(() => serviceCreator(fakeServiceA))
      .then(() => serviceCreator(fakeServiceB))
      .then(() => {
        request(app)
          .get('/service-registry/v1/service')
          .end((err, res) => {
            assert.equal(res.status, 200, 'expected a success status code');
            assert.equal(res.body.length, 2);

            const results = res.body.map(({_id, environments, links}) => ({_id, environments, links}));

            assert.equal(results[0]._id, fakeServiceA._id, 'expected _id from database to match');
            assert.equal(results[0].environments.length, fakeServiceA.environments.length, 'expected number of environments incorrect')
            assert.equal(results[0].environments[0].name, fakeServiceA.environments[0].name, 'expected retrieved environment name to match posted environment name');
            assert.equal(results[0].environments[0].baseUrl, fakeServiceA.environments[0].baseUrl, 'expected retrieved environment baseUrl to match posted environment baseUrl');
            assert.equal(results[0].links.length, fakeServiceA.links.length, 'expected number of links incorrect')
            assert.equal(results[0].links[0].name, fakeServiceA.links[0].name, 'expected retrieved link name to match posted link name');
            assert.equal(results[0].links[0].url, fakeServiceA.links[0].url, 'expected retrieved link url to match posted link url');

            assert.equal(results[1]._id, fakeServiceB._id, 'expected _id from database to match');
            assert.equal(results[1].environments.length, fakeServiceB.environments.length, 'expected number of environments incorrect')
            assert.equal(results[1].environments[0].name, fakeServiceB.environments[0].name, 'expected retrieved environment name to match posted environment name');
            assert.equal(results[1].environments[0].baseUrl, fakeServiceB.environments[0].baseUrl, 'expected retrieved environment baseUrl to match posted environment baseUrl');
            assert.equal(results[1].links.length, fakeServiceB.links.length, 'expected number of links incorrect')
            assert.equal(results[1].links[0].name, fakeServiceB.links[0].name, 'expected retrieved link name to match posted link name');
            assert.equal(results[1].links[0].url, fakeServiceB.links[0].url, 'expected retrieved link url to match posted link url');

          });
      });

  });

});
