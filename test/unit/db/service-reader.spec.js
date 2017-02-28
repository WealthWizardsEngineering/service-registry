const test = require('tape');
const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru();

test('getServices', t => {

  t.test('should pass query and projection ', assert => {

    assert.plan(2);

    const fakeQuery = 'fake query';
    const fakeProjection = 'fake projection';

    const execSpy = sinon.spy();
    const selectStub = sinon.stub().withArgs(fakeProjection).returns({ exec: execSpy });
    const findStub = sinon.stub().withArgs(fakeQuery).returns({ select: selectStub });

    const serviceStub = {
      find: findStub,
    };

    const { getServices } = proxyquire('../../../src/db/service-reader', { './service-model': serviceStub });
    const target = getServices;

    target(fakeQuery, fakeProjection);

    assert.true(execSpy.calledWithExactly(), 'expected exec to be called');
    assert.true(execSpy.calledOnce, 'expected exec to be called once');

  });

});

test('getService', t => {

  t.test('should find by id', assert => {

    assert.plan(2);

    const fakeId = 'fake id';

    const execSpy = sinon.spy();
    const findStub = sinon.stub().withArgs(fakeId).returns({ exec: execSpy });

    serviceStub = {
      findById: findStub,
    };

    const { getService } = proxyquire('../../../src/db/service-reader', { './service-model': serviceStub });
    const target = getService;

    target(fakeId);

    assert.true(execSpy.calledWithExactly(), 'expected exec to be called');
    assert.true(execSpy.calledOnce, 'expected exec to be called once');

  });

});
