const test = require('tape');
const proxyquire = require('proxyquire').noCallThru();

test('routes', (t) => {

  t.test('creates a POST route for /v1/service', assert => {

    assert.plan(3);

    const fakeApp = {
      post: (route, ...middleware) => {
        assert.equal(route, '/v1/service');
        assert.deepEqual(middleware[0], { body: 'create-service-validation' }, 'create service validation correct');
        assert.equal(middleware[1], 'create-service');
      },
      put: () => {},
      get: () => {},
    };

    const target = proxyquire('../../../src/routes/', {
      '../rules/create-service-validation': 'create-service-validation',
      './create-service': 'create-service',
      'ww-validation': {
        requestValidator: (rule) => rule
      }
    });

    target(fakeApp);

  });

  t.test('creates a GET route for /v1/service', assert => {

    assert.plan(2);

    const fakeApp = {
      post: () => {},
      put: () => {},
      get: (route, ...middleware) => {
        if (route === '/v1/service') {
          assert.equal(route, '/v1/service');
          assert.equal(middleware[1], 'get-services');
        }
      },
    };

    const target = proxyquire('../../../src/routes/', {
      './get-services': 'get-services',
    });

    target(fakeApp);

  });

  t.test('creates a GET route for /v1/service/:id', assert => {

    assert.plan(2);

    const fakeApp = {
      post: () => {},
      put: () => {},
      get: (route, ...middleware) => {
        if (route === '/v1/service/:id') {
          assert.equal(route, '/v1/service/:id');
          assert.equal(middleware[1], 'get-service');
        }
      },
    };

    const target = proxyquire('../../../src/routes/', {
      './get-service': 'get-service',
    });

    target(fakeApp);

  });

  t.test('creates a PUT route for /v1/service/:id', assert => {

    assert.plan(2);

    const fakeApp = {
      post: () => {},
      get: () => {},
      put: (route, ...middleware) => {
        if (route === '/v1/service/:id') {
          assert.equal(route, '/v1/service/:id');
          assert.equal(middleware[1], 'update-service');
        }
      },
    };

    const target = proxyquire('../../../src/routes/', {
      './update-service': 'update-service',
    });

    target(fakeApp);

  });


  t.test('creates a GET route for /v1/tag', assert => {

    assert.plan(2);

    const fakeApp = {
      post: () => {},
      put: () => {},
      get: (route, ...middleware) => {
        if (route === '/v1/tag') {
          assert.equal(route, '/v1/tag');
          assert.equal(middleware[0], 'get-tags');
        }
      },
    };

    const target = proxyquire('../../../src/routes/', {
      './get-tags': 'get-tags',
    });

    target(fakeApp);

  });

});
