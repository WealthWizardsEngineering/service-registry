const test = require('tape');
const proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');

test('create service', (t) => {

  t.test('returns a 201 and created data on create service success', (t) => {

    t.plan(3);

    const fakeSend = sinon.spy();
    const fakeLocation = sinon.stub();
    fakeLocation.withArgs('/test-url/v1/service/fake-id').returns({ send: fakeSend });
    const fakeStatus = sinon.stub();
    fakeStatus.withArgs(201).returns({ location: fakeLocation });
    const fakeReq = {
      originalUrl: '/test-url/v1/service',
      body: { _id: 'fake-id', other: 'fake body' }
    };
    const fakeRes = {
      status: fakeStatus
    };
    const fakeNext = sinon.spy();

    const target = proxyquire('../../../src/routes/create-service', {
      '../db/service-creator': (body) => {
        t.equal(body, fakeReq.body);
        return Promise.resolve({_id: 'fake-id'})
      }
    });

    target(fakeReq, fakeRes, fakeNext);

    setImmediate(() => {
      t.assert(fakeSend.calledWithExactly(), 'expected fake send to be called');
      t.assert(fakeNext.neverCalledWith(),  'expected next to never be called');
    });

  });

  t.test('calls next with Resource Exists error when trying to create an id that already exists', (t) => {

    t.plan(1);

    const fakeReq = {};
    const fakeRes = {};
    const fakeNext = sinon.spy();

    function fakeApiError(message, code, other) {
      this.error = `${message}:${code}:${other}`;
    }

    const fakeResourcesExists = 'fake resource exists';

    const target = proxyquire('../../../src/routes/create-service', {
      '../db/service-creator': () => {
        return Promise.reject({code: 11000})
      },
      '../api-error': fakeApiError,
      '../error-codes': { RESOURCE_EXISTS: fakeResourcesExists }
    });

    target(fakeReq, fakeRes, fakeNext)

    setImmediate(() => {
      t.assert(fakeNext.calledWithExactly(sinon.match((e) => e.error === `The id already exists, try using PUT to update it:${fakeResourcesExists}:409`)));
    });

  })

  t.test('calls next with Internal Server Error on create service failure', (t) => {

    t.plan(1);

    const fakeReq = {};
    const fakeRes = {};
    const fakeNext = sinon.spy();

    function fakeApiError(message, code, other) {
      this.error = `${message}:${code}:${other}`;
    }

    const fakeInternalServerError = 'fake internal server error';

    const target = proxyquire('../../../src/routes/create-service', {
      '../db/service-creator': () => {
        return Promise.reject({code: 1234})
      },
      '../api-error': fakeApiError,
      '../error-codes': { INTERNAL_SERVER_ERROR: fakeInternalServerError }
    });

    target(fakeReq, fakeRes, fakeNext)

    setImmediate(() => {
      t.assert(fakeNext.calledWithExactly(sinon.match((e) => e.error === `Internal server error:${fakeInternalServerError}:500`)));
    });

  })
});
