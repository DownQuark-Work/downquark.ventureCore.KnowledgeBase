var PausableTokenMock = artifacts.require("PausableTokenMock.sol");

const tests = require("@daonomic/tests-common");
const expectThrow = tests.expectThrow;

contract('PausableToken', function(accounts) {

  let token;

  beforeEach(async function() {
    token = await PausableTokenMock.new(accounts[0], 10000);
  });

  it("should be active after create", async () => {
    assert.equal(await token.paused(), false);
  });

  it("should let transfer when not paused", async () => {
    await token.transfer(accounts[1], 100);
    assert.equal(await token.balanceOf(accounts[1]), 100);
  });

  it("should not let transfer when paused", async () => {
    await token.pause();

    await expectThrow(
        token.transfer(accounts[1], 100)
    );
  });

  it("should let transfer after unpause", async () => {
    await token.pause();
    await token.unpause();

    await token.transfer(accounts[1], 100);
    assert.equal(await token.balanceOf(accounts[1]), 100);
  });

});