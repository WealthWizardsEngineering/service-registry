const test = require('tape');
const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru();

test('getTags', t => {

  t.test('should call get a list of tags from the database ', assert => {

    assert.plan(2);

    const execSpy = sinon.spy();
    const aggregatetub = sinon.stub();
    aggregatetub.withArgs([
      {$unwind: "$tags"},
      {$group:{_id:null, tagSet: {$addToSet: "$tags"}}},
      {$project:{_id:0, tags: "$tagSet"}}
    ]).returns({ exec: execSpy });

    const serviceStub = {
      aggregate: aggregatetub,
    };

    const { getTags } = proxyquire('../../../src/db/tag-reader', { './service-model': serviceStub });
    const target = getTags;

    target();

    assert.true(execSpy.calledWithExactly(), 'expected exec to be called');
    assert.true(execSpy.calledOnce, 'expected exec to be called once');

  });
});
