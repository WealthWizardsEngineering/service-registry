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

  t.test('should update a service correctly', assert => {

    assert.plan(8);

    const fakeService = {
      _id: 'my-fake-service',
      environments: [{
        name: 'green',
        baseUrl: 'https://bob.com',
      }],
      links: [{
        name:'ping',
        url: '/ping'
      }],
    };

    const updatedFakeService = {
      _id: 'my-fake-service',
      environments: [{
        name: 'blue',
        baseUrl: 'https://bob.com',
      }],
      links: [{
        name:'ping',
        url: '/ping'
      }],
    };

    clearDownServiceDB()
      .then(() => serviceCreator(fakeService))
      .then(() => {
        request(app)
          .put('/service-registry/v1/service/my-fake-service')
          .send(updatedFakeService)
          .end((err, res) => {
            assert.equal(res.status, 204, 'expect created response code');
            serviceReader.getService(fakeService._id)
              .then((result) => {
                assert.equal(result._id, updatedFakeService._id, 'expected retrieved id to match posted id');
                assert.equal(result.environments.length, updatedFakeService.environments.length, 'expected number of environments incorrect')
                assert.equal(result.environments[0].name, updatedFakeService.environments[0].name, 'expected retrieved environment name to match posted environment name');
                assert.equal(result.environments[0].baseUrl, updatedFakeService.environments[0].baseUrl, 'expected retrieved environment baseUrl to match posted environment baseUrl');
                assert.equal(result.links.length, updatedFakeService.links.length, 'expected number of links incorrect')
                assert.equal(result.links[0].name, updatedFakeService.links[0].name, 'expected retrieved link name to match posted link name');
                assert.equal(result.links[0].url, updatedFakeService.links[0].url, 'expected retrieved link url to match posted link url');
              })
              .catch((error) => {
                console.log("ERROR: " + error);
                return;
              });
          });
      });
  });

});
