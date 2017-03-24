const test = require('tape');
const proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');

test('get services', t => {

  t.test('should build query from whitelist', assert => {

    assert.plan(1);

    const fakeReq = { query: {} };

    const expectedWhitelist = [
      '_id',
      'tags'
    ];

    const target = proxyquire('../../../src/routes/get-services', {
      '../db/helpers': {
        buildQuery: (whitelist) => {
          assert.deepEqual(whitelist, expectedWhitelist);

          return () => ({});
        },
        buildProjection: () => () => {
        },
      },
      '../db/service-reader': {
        getServices: () => Promise.resolve(),
      },
    });

    target(fakeReq);

  });

  t.test('should build projection from whitelist', assert => {

    assert.plan(1);

    const fakeReq = { query: {} };

    const expectedWhitelist = [
      '_id',
    ];

    const target = proxyquire('../../../src/routes/get-services', {
      '../db/helpers': {
        buildProjection: (whitelist) => {
          assert.deepEqual(whitelist, expectedWhitelist);

          return () => ({});
        },
        buildQuery: () => () => {
        },
      },
      '../db/service-reader': {
        getServices: () => Promise.resolve(),
      },
    });

    target(fakeReq);

  });

  t.test('should send results from service reader', assert => {

    assert.plan(5);

    const fakeReq = { query: { fields: 'fake fields' } };
    const fakeRes = { send: sinon.spy() };

    const fakeQuery = 'fake query';
    const fakeProjection = 'fake projection';
    const fakeResults = 'fake results';

    const target = proxyquire('../../../src/routes/get-services', {
      '../db/helpers': {
        buildQuery: () => query => {
          assert.deepEqual(query, fakeReq.query);

          return fakeQuery;
        },
        buildProjection: () => fields => {
          assert.deepEqual(fields, fakeReq.query.fields);

          return fakeProjection;
        },
      },
      '../db/service-reader': {
        getServices: (query, projection) => {
          assert.equal(query, fakeQuery);
          assert.equal(projection, fakeProjection);

          return Promise.resolve(fakeResults);
        },
      },
    });

    target(fakeReq, fakeRes);

    setImmediate(() => {
      assert.true(fakeRes.send.calledWithExactly(fakeResults));
    });

  });

});
