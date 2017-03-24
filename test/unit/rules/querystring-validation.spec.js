const test = require('tape');
const proxyquire = require('proxyquire').noCallThru();

test('querystring validation', assert => {

  assert.plan(1);

  const fakeJoi = {
    object: () => ({
      keys: (keys) => keys,
    }),
    string: () => 'string',
  };

  const target = proxyquire('../../../src/rules/querystring-validation', { 'joi': fakeJoi });

  const expectedKeys = {
    _id: 'string',
    tags: 'string',
    fields: 'string',
  };

  assert.deepEqual(target, expectedKeys);

});
