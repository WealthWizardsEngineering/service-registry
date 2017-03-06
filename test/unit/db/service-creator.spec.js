const test = require('tape');
const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru();

test('service creator', t => {

  t.test('should create a new service model and call save', assert => {

    assert.plan(5);

    const fakeData = {
      _id: 'a fake _id',
      environments: [{
        _id: 'a fake environment _id',
        baseUrl: 'a fake environment baseUrl'
      }],
      links: [{
        _id: 'a fake link _id',
        url: 'a fake link url'
      }],
    };

    const fakeSave = sinon.spy();

    function serviceStub(schema) {
      assert.equal(schema._id, fakeData._id, 'the expected service id should be saved');
      assert.deepEqual(schema.environments, fakeData.environments, 'the expected environments list should be saved');
      assert.deepEqual(schema.links, fakeData.links, 'the expected links list should be saved');

      this.save = fakeSave;
    }

    const target = proxyquire('../../../src/db/service-creator', { './service-model': serviceStub });

    target(fakeData);

    assert.true(fakeSave.calledWithExactly(), 'expected save to be called');
    assert.true(fakeSave.calledOnce, 'expected save to be called once');

  });

});
