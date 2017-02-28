const test = require('tape');
const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru();

test('service updater', t => {

  t.test('should find and update service in database', assert => {

    assert.plan(1);

    const fakeData = {
      _id: 'a fake _id',
      environments: [{
        name: 'a fake environment name',
        baseUrl: 'a fake environment baseUrl'
      }],
      links: [{
        name: 'a fake link name',
        url: 'a fake link url'
      }],
    };

    const fakeExec = sinon.spy();
    const findOneAndUpdateStub = sinon.stub();
    findOneAndUpdateStub.withArgs({ _id: fakeData._id }, { $set: fakeData }).returns({ exec: fakeExec });

    const serviceStub = {
      findOneAndUpdate: findOneAndUpdateStub
    };

    const target = proxyquire('../../../src/db/service-updater', { './service-model': serviceStub });

    target(fakeData);

    assert.true(fakeExec.calledOnce, 'expected exec to be called once');

  });

});
