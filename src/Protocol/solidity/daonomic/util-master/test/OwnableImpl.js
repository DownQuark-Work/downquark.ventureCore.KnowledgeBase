var OwnableImpl = artifacts.require("OwnableImpl.sol")
var expectThrow = require('@daonomic/tests-common').expectThrow;

contract('OwnableImpl', function(accounts) {
  let ownable;

  beforeEach(async function() {
    ownable = await OwnableImpl.new();
  });

  it('should have an owner', async function() {
    let owner = await ownable.owner();
    assert.isTrue(owner !== 0);
  });

  it('changes owner after transfer', async function() {
    let other = accounts[1];
    await ownable.transferOwnership(other);
    let owner = await ownable.owner();

    assert.isTrue(owner === other);
  });

  it('should prevent non-owners from transfering', async function() {
    const other = accounts[2];
    const owner = await ownable.owner.call();
    assert.isTrue(owner !== other);

    await expectThrow(
        ownable.transferOwnership(other, {from: other})
    );
  });

  it('should guard ownership against stuck state', async function() {
    let originalOwner = await ownable.owner();

    await expectThrow(
        ownable.transferOwnership("0x0000000000000000000000000000000000000000", {from: originalOwner})
    );
  });
});