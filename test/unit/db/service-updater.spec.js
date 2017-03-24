const test = require('tape');
const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru();

test('service updater', t => {

  t.test('should find and update service in database', assert => {

    assert.plan(1);

    const fakeRequestData = {
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

    const fakeDatabaseData = {
      _id: 'a fake _id',
      tags: undefined,
      environments: [{
        _id: 'a fake environment _id',
        baseUrl: 'a fake environment baseUrl'
      }],
      links: [{
        _id: 'a fake link _id',
        url: 'a fake link url'
      }],
    };

    const fakeExec = sinon.spy();
    const findOneAndUpdateStub = sinon.stub();
    findOneAndUpdateStub.withArgs({ _id: fakeData._id }, { $set: fakeDatabaseData }).returns({ exec: fakeExec });

    const serviceStub = {
      findOneAndUpdate: findOneAndUpdateStub
    };

    const target = proxyquire('../../../src/db/service-updater', { './service-model': serviceStub });

    target(fakeRequestData);

    assert.true(fakeExec.calledOnce, 'expected exec to be called once');

  });

});
