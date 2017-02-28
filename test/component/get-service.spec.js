const test = require('tape');
const request = require('supertest');
const { app } = require('../../src/server');
const Service = require('../../src/db/service-model');
const clearDownServiceDB = () => Service.remove();
const serviceCreator = require('../../src/db/service-creator');
const jwt = require('jsonwebtoken');
const env = require('../../src/env-vars');
const Joi = require('joi');

test('get service', (t) => {

  t.test('should return service for the given id', assert => {

    assert.plan(8);

    const fakeServiceA = {
      _id: 'my-fake-service-a',
      environments: [{
        name: 'green-a',
        baseUrl: 'https://bob.com/a',
      }],
      links: [{
        name:'ping-a',
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
        name:'ping-b',
        url: '/ping-b'
      }],
    };

    clearDownServiceDB()
      .then(() => serviceCreator(fakeServiceA))
      .then(() => serviceCreator(fakeServiceB))
      .then(() => {
        request(app)
          .get('/service-registry/v1/service/my-fake-service-b')
          .end((err, res) => {
            assert.equal(res.status, 200, 'expected a success status code');
            assert.equal(res.body._id, fakeServiceB._id, 'expected _id from database to match');
            assert.equal(res.body.environments.length, fakeServiceB.environments.length, 'expected number of environments incorrect')
            assert.equal(res.body.environments[0].name, fakeServiceB.environments[0].name, 'expected retrieved environment name to match posted environment name');
            assert.equal(res.body.environments[0].baseUrl, fakeServiceB.environments[0].baseUrl, 'expected retrieved environment baseUrl to match posted environment baseUrl');
            assert.equal(res.body.links.length, fakeServiceB.links.length, 'expected number of links incorrect')
            assert.equal(res.body.links[0].name, fakeServiceB.links[0].name, 'expected retrieved link name to match posted link name');
            assert.equal(res.body.links[0].url, fakeServiceB.links[0].url, 'expected retrieved link url to match posted link url');
          });
      });
  });

});
