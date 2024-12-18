var Pausable = artifacts.require("PausableMock.sol")
var expectThrow = require('@daonomic/tests-common').expectThrow;

contract('Pausable', function(accounts) {
  let pausable;

  beforeEach(async function() {
    pausable = await Pausable.new();
  });

  it('should be active after create', async function() {
    assert.equal(await pausable.paused(), false);
    assert.equal(await pausable.drasticMeasureTaken(), false);
    assert.equal(await pausable.count(), 0);

    await pausable.normalProcess();
    assert.equal(await pausable.count(), 1);
  });

  it('should throw when paused', async function() {
    await pausable.pause();
    await expectThrow(
        pausable.normalProcess()
    );
  });

  it('should let call drasticMeasure when paused', async function() {
    await pausable.pause();
    await pausable.drasticMeasure();
    assert.equal(await pausable.drasticMeasureTaken(), true);
  });

  it('should not let call drasticMeasure when active', async function() {
    await expectThrow(
        pausable.drasticMeasure()
    );
  });

  it('should let unpause if paused', async function() {
    await pausable.pause();
    await pausable.unpause();

    await pausable.normalProcess();
    assert.equal(await pausable.count(), 1);
  });
});