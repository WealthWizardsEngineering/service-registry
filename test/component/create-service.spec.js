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
                assert.equal(result.environments.length, fakeService.environments.length, 'expected number of environments incorrect')
                assert.equal(result.environments[0].name, fakeService.environments[0].name, 'expected retrieved environment name to match posted environment name');
                assert.equal(result.environments[0].baseUrl, fakeService.environments[0].baseUrl, 'expected retrieved environment baseUrl to match posted environment baseUrl');
                assert.equal(result.links.length, fakeService.links.length, 'expected number of links incorrect')
                assert.equal(result.links[0].name, fakeService.links[0].name, 'expected retrieved link name to match posted link name');
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
        name: 'green',
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
          .post('/service-registry/v1/service')
          .send(fakeService)
          .end((err, res) => {
            assert.equal(res.status, 409, 'expect created response code');
          });
      });
  });

});
