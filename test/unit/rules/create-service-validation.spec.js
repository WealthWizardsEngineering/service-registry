const test = require('tape');
const proxyquire = require('proxyquire').noCallThru();

test('create service validation', t => {

  t.test('creates a Joi validation object', assert => {

    assert.plan(1);

    const fakeJoi = {
      object: () => ({
        keys: (keys) => keys
      }),
      string: () => ({
        required: () => 'string:required',
        uri: () => ({
          required: () => 'string:uri:required',
        }),
      }),
      array: () => ({
        items: () => ({
          optional: () => ({
            allow: () => 'array:items:optional:allow',
          }),
        }),
      }),
    };

    const target = proxyquire('../../../src/rules/create-service-validation', { 'joi': fakeJoi });

    const expectedKeys = {
      _id: 'string:required',
      environments: 'array:items:optional:allow',
      links: 'array:items:optional:allow',
    };

    assert.deepEqual(target, expectedKeys);

  });

});
