const test = require('tape');
const request = require('supertest');
const { app } = require('../../src/server');
const Service = require('../../src/db/service-model');
const clearDownServiceDB = () => Service.remove();
const serviceCreator = require('../../src/db/service-creator');
const serviceReader = require('../../src/db/service-reader');
const jwt = require('jsonwebtoken');
const env = require('../../src/env-vars');
const Joi = require('joi');

test('create service', (t) => {

  t.test('should create a service correctly', assert => {

    assert.plan(10);

    const fakeService = {
      _id: 'my-fake-service',
      tags: ["my-fake-tag-1"],
      environments: [{
        _id: 'green',
        baseUrl: 'https://bob.com',
      }],
      links: [{
        _id:'ping',
        url: '/ping'
      }],
    };

    clearDownServiceDB()
      .then(() => {
        request(app)
          .post('/service-registry/v1/service')
          .send(fakeService)
          .end((err, res) => {
            assert.equal(res.status, 201, 'expect created response code');
            serviceReader.getService(fakeService._id)
              .then((result) => {
                assert.equal(result._id, fakeService._id, 'expected retrieved id to match posted id');
                assert.equal(result.tags.length, fakeService.tags.length, 'expected number of tags')
                assert.equal(result.tags[0], fakeService.tags[0], 'expected retrieved tag to match posted tag');
                assert.equal(result.environments.length, fakeService.environments.length, 'expected number of environments')
                assert.equal(result.environments[0]._id, fakeService.environments[0]._id, 'expected retrieved environment _id to match posted environment _id');
                assert.equal(result.environments[0].baseUrl, fakeService.environments[0].baseUrl, 'expected retrieved environment baseUrl to match posted environment baseUrl');
                assert.equal(result.links.length, fakeService.links.length, 'expected number of links')
                assert.equal(result.links[0]._id, fakeService.links[0]._id, 'expected retrieved link _id to match posted link _id');
                assert.equal(result.links[0].url, fakeService.links[0].url, 'expected retrieved link url to match posted link url');
              })
              .catch((error) => {
                console.log("ERROR: " + error);
                return;
              });
          });
      });
  });


  t.test('should fail to create a service if it already exists', assert => {

    assert.plan(1);

    const fakeService = {
      _id: 'my-fake-service',
      environments: [{
        _id: 'green',
        baseUrl: 'https://bob.com',
      }],
      links: [{
        _id:'ping',
        url: '/ping'
      }],
    };

    clearDownServiceDB()
      .then(() => serviceCreator(fakeService))
      .then(() => {
        request(app)
          .post('/service-registry/v1/service')
          .send(fakeService)
          .end((err, res) => {
            assert.equal(res.status, 409, 'expect created response code');
          });
      });
  });

});
