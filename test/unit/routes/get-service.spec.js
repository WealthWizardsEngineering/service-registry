const test = require('tape');
const proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');

test('get service', t => {

  t.test('should send results from service reader', assert => {
    assert.plan(2);

    const fakeId = 'fake id';
    const fakeReq = {
      params: {
        id: fakeId,
      },
    };
    const fakeRes = { send: sinon.spy() };

    const fakeResult = 'fake result';

    const target = proxyquire('../../../src/routes/get-service', {
      '../db/service-reader': {
        getService: (id) => {
          assert.equal(id, fakeId, 'the id passed to getService should match the request');

          return Promise.resolve(fakeResult);
        },
      },
    });

    target(fakeReq, fakeRes);

    setImmediate(() => {
      assert.true(fakeRes.send.calledWithExactly(fakeResult));
    });

  });

});
