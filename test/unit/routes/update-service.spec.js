const test = require('tape');
const proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');

test('update service', (t) => {

  t.test('returns a 201 if service does not already exist and the creation was a success', (t) => {

    t.plan(3);

    const fakeSend = sinon.spy();
    const fakeStatus = sinon.stub();
    fakeStatus.withArgs(201).returns({ send: fakeSend });
    const fakeReq = {
      body: 'fake body'
    };
    const fakeRes = {
      status: fakeStatus
    };
    const fakeNext = sinon.spy();

    const target = proxyquire('../../../src/routes/update-service', {
      '../db/service-updater': (body) => {
        t.equal(body, fakeReq.body, 'unexpected body passed to service updater');
        return Promise.resolve()
      }
    });

    target(fakeReq, fakeRes, fakeNext);

    setImmediate(() => {
      t.assert(fakeSend.calledWithExactly(), 'expected fake send to be called');
      t.assert(fakeNext.neverCalledWith(),  'expected next to never be called');
    });

  });

  t.test('returns a 204 if service already exists and the update was a success', (t) => {

    t.plan(3);

    const fakeSend = sinon.spy();
    const fakeStatus = sinon.stub();
    fakeStatus.withArgs(204).returns({ send: fakeSend });
    const fakeReq = {
      body: 'fake body'
    };
    const fakeRes = {
      status: fakeStatus
    };
    const fakeNext = sinon.spy();

    const target = proxyquire('../../../src/routes/update-service', {
      '../db/service-updater': (body) => {
        t.equal(body, fakeReq.body, 'unexpected body passed to service updater');
        return Promise.resolve(fakeReq)
      }
    });

    target(fakeReq, fakeRes, fakeNext);

    setImmediate(() => {
      t.assert(fakeSend.calledWithExactly(), 'expected fake send to be called');
      t.assert(fakeNext.neverCalledWith(),  'expected next to never be called');
    });

  });

  t.test('calls next with Internal Server Error on create service failure', (t) => {

    t.plan(1);

    const fakeReq = {};
    const fakeRes = {};
    const fakeNext = sinon.spy();

    function fakeApiError(message, code, other) {
      this.error = `${message}:${code}:${other}`;
    }

    const fakeInternalServerError = 'fake internal server error';

    const target = proxyquire('../../../src/routes/update-service', {
      '../db/service-updater': () => {
        return Promise.reject()
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
