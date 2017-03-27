const test = require('tape');
const proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');

test('get tags', t => {

  t.test('should respond with tag list from results', assert => {

    assert.plan(1);

    const fakeReq = { };
    const fakeRes = { send: sinon.spy() };

    const fakeDatabaseResult = [ { tags: [ 'fake-tag-a', 'fake-tag-2', 'fake-tag-1' ] } ];
    const fakeResults = [ 'fake-tag-a', 'fake-tag-2', 'fake-tag-1' ];

    const target = proxyquire('../../../src/routes/get-tags', {
      '../db/helpers': {
      },
      '../db/tag-reader': {
        getTags: () => {
          return Promise.resolve(fakeDatabaseResult);
        },
      },
    });

    target(fakeReq, fakeRes);

    setImmediate(() => {
      assert.true(fakeRes.send.calledWithExactly(fakeResults));
    });

  });

  t.test('should return an empty array if no tag exist', assert => {

    assert.plan(1);

    const fakeReq = { };
    const fakeRes = { send: sinon.spy() };

    const fakeDatabaseResult = [];
    const fakeResults = [];

    const target = proxyquire('../../../src/routes/get-tags', {
      '../db/helpers': {
      },
      '../db/tag-reader': {
        getTags: () => {
          return Promise.resolve(fakeDatabaseResult);
        },
      },
    });

    target(fakeReq, fakeRes);

    setImmediate(() => {
      assert.true(fakeRes.send.calledWithExactly(fakeResults));
    });

  });

});
