const test = require('tape');
const proxyquire = require('proxyquire').noCallThru();
const timekeeper = require('timekeeper');

test('service model', (t) => {

  t.test('creates a new mongoose schema', assert => {

    assert.plan(5);

    const fakeObjectId = 'fake object id';

    timekeeper.freeze(new Date());

    function fakeSchema(schema, options) {
      assert.deepEqual(schema._id, { type: String }, 'expected id to be of type string');
      assert.deepEqual(schema.tags, [ { type: String } ], 'expected tags to be an array of strings' ),
      assert.deepEqual(schema.environments, [ { _id: { type: String }, baseUrl: { type: String } } ], 'expected environments to be a list');
      assert.deepEqual(schema.links, [ { _id: { type: String }, url: { type: String } } ], 'expected links to be a list');
    }

    fakeSchema.Types = {
      ObjectId: fakeObjectId,
    };

    const fakeMongoose = {
      Schema: fakeSchema,
      model: (name, schema) => {
        return `${name}:${schema.constructor.name}`;
      },
    };

    const target = proxyquire('../../../src/db/service-model', { mongoose: fakeMongoose });

    assert.equal(target, 'Service:fakeSchema', 'expected service model to be of the correct type');

    timekeeper.reset();

  });

});
