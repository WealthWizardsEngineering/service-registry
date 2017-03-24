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

  t.test('should return all services', assert => {

    assert.plan(18);

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
          .get('/service-registry/v1/service')
          .end((err, res) => {
            assert.equal(res.status, 200, 'expected a success status code');
            assert.equal(res.body.length, 2);

            const results = res.body.map(({_id, tags, environments, links}) => ({_id, tags, environments, links}));

            assert.equal(results[0]._id, fakeServiceA._id, 'expected _id from database to match');
            assert.equal(results[0].tags.length, fakeServiceA.tags.length, 'expected number of tags incorrect')
            assert.equal(results[0].environments.length, fakeServiceA.environments.length, 'expected number of environments incorrect')
            assert.equal(results[0].environments[0]._id, fakeServiceA.environments[0]._id, 'expected retrieved environment _id to match posted environment _id');
            assert.equal(results[0].environments[0].baseUrl, fakeServiceA.environments[0].baseUrl, 'expected retrieved environment baseUrl to match posted environment baseUrl');
            assert.equal(results[0].links.length, fakeServiceA.links.length, 'expected number of links incorrect')
            assert.equal(results[0].links[0]._id, fakeServiceA.links[0]._id, 'expected retrieved link _id to match posted link _id');
            assert.equal(results[0].links[0].url, fakeServiceA.links[0].url, 'expected retrieved link url to match posted link url');

            assert.equal(results[1]._id, fakeServiceB._id, 'expected _id from database to match');
            assert.equal(results[1].tags.length, fakeServiceB.tags.length, 'expected number of tags incorrect')
            assert.equal(results[1].environments.length, fakeServiceB.environments.length, 'expected number of environments incorrect')
            assert.equal(results[1].environments[0]._id, fakeServiceB.environments[0]._id, 'expected retrieved environment _id match posted environment _id');
            assert.equal(results[1].environments[0].baseUrl, fakeServiceB.environments[0].baseUrl, 'expected retrieved environment baseUrl to match posted environment baseUrl');
            assert.equal(results[1].links.length, fakeServiceB.links.length, 'expected number of links incorrect')
            assert.equal(results[1].links[0]._id, fakeServiceB.links[0]._id, 'expected retrieved link _id to match posted link _id');
            assert.equal(results[1].links[0].url, fakeServiceB.links[0].url, 'expected retrieved link url to match posted link url');

          });
      });

  });

  t.test('should return all services with the tag from the query', assert => {

    assert.plan(12);

    const fakeServiceA = {
      _id: 'my-fake-service-a',
      tags: [
        "fake-tag-1",
        "fake-tag-2"
      ],
      environments: [{
        _id: 'green-a',
        baseUrl: 'https://bob.com/a',
      }]
    };

    const fakeServiceB = {
      _id: 'my-fake-service-b',
      tags: [
        "fake-tag-1",
      ],
      environments: [{
        _id: 'green-b',
        baseUrl: 'https://bob.com/b',
      }]
    };

    const fakeServiceC = {
      _id: 'my-fake-service-c',
      tags: [
        "fake-tag-2"
      ],
      environments: [{
        _id: 'green-c',
        baseUrl: 'https://bob.com/c',
      }]
    };

    clearDownServiceDB()
      .then(() => serviceCreator(fakeServiceA))
      .then(() => serviceCreator(fakeServiceB))
      .then(() => serviceCreator(fakeServiceC))
      .then(() => {
        request(app)
          .get('/service-registry/v1/service?tags=fake-tag-2')
          .end((err, res) => {
            assert.equal(res.status, 200, 'expected a success status code');
            assert.equal(res.body.length, 2);

            const results = res.body.map(({_id, tags, environments}) => ({_id, tags, environments}));

            assert.equal(results[0]._id, fakeServiceA._id, 'expected _id from database to match');
            assert.equal(results[0].tags.length, fakeServiceA.tags.length, 'expected number of tags incorrect')
            assert.equal(results[0].environments.length, fakeServiceA.environments.length, 'expected number of environments incorrect')
            assert.equal(results[0].environments[0]._id, fakeServiceA.environments[0]._id, 'expected retrieved environment _id to match posted environment _id');
            assert.equal(results[0].environments[0].baseUrl, fakeServiceA.environments[0].baseUrl, 'expected retrieved environment baseUrl to match posted environment baseUrl');

            assert.equal(results[1]._id, fakeServiceC._id, 'expected _id from database to match');
            assert.equal(results[1].tags.length, fakeServiceC.tags.length, 'expected number of tags incorrect')
            assert.equal(results[1].environments.length, fakeServiceC.environments.length, 'expected number of environments incorrect')
            assert.equal(results[1].environments[0]._id, fakeServiceC.environments[0]._id, 'expected retrieved environment _id match posted environment _id');
            assert.equal(results[1].environments[0].baseUrl, fakeServiceC.environments[0].baseUrl, 'expected retrieved environment baseUrl to match posted environment baseUrl');

          });
      });

  });

  t.test('should return all services with all the tags from the query', assert => {

    assert.plan(7);

    const fakeServiceA = {
      _id: 'my-fake-service-a',
      tags: [
        "fake-tag-1",
        "fake-tag-2"
      ],
      environments: [{
        _id: 'green-a',
        baseUrl: 'https://bob.com/a',
      }]
    };

    const fakeServiceB = {
      _id: 'my-fake-service-b',
      tags: [
        "fake-tag-1",
      ],
      environments: [{
        _id: 'green-b',
        baseUrl: 'https://bob.com/b',
      }]
    };

    const fakeServiceC = {
      _id: 'my-fake-service-c',
      tags: [
        "fake-tag-2"
      ],
      environments: [{
        _id: 'green-c',
        baseUrl: 'https://bob.com/c',
      }]
    };

    clearDownServiceDB()
      .then(() => serviceCreator(fakeServiceA))
      .then(() => serviceCreator(fakeServiceB))
      .then(() => serviceCreator(fakeServiceC))
      .then(() => {
        request(app)
          .get('/service-registry/v1/service?tags=fake-tag-2,fake-tag-1')
          .end((err, res) => {
            assert.equal(res.status, 200, 'expected a success status code');
            assert.equal(res.body.length, 1);

            const results = res.body.map(({_id, tags, environments}) => ({_id, tags, environments}));

            assert.equal(results[0]._id, fakeServiceA._id, 'expected _id from database to match');
            assert.equal(results[0].tags.length, fakeServiceA.tags.length, 'expected number of tags incorrect')
            assert.equal(results[0].environments.length, fakeServiceA.environments.length, 'expected number of environments incorrect')
            assert.equal(results[0].environments[0]._id, fakeServiceA.environments[0]._id, 'expected retrieved environment _id to match posted environment _id');
            assert.equal(results[0].environments[0].baseUrl, fakeServiceA.environments[0].baseUrl, 'expected retrieved environment baseUrl to match posted environment baseUrl');

          });
      });

  });
});
