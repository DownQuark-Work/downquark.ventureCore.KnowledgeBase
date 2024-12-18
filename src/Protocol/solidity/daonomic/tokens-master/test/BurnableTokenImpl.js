var BurnableTokenMock = artifacts.require("BurnableTokenMock.sol");

const tests = require("@daonomic/tests-common");
const expectThrow = tests.expectThrow;

contract('BurnableTokenImpl', function(accounts) {

  let token;

  beforeEach(async function() {
    token = await BurnableTokenMock.new(accounts[5], 1000);
  });

  it("should let burn tokens", async () => {
	await token.burn(999, {from: accounts[5]});
	assert.equal(await token.balanceOf(accounts[5]), 1);
	assert.equal(await token.totalSupply(), 1);
  });

  it("should not let burn more than you have", async () => {
	await expectThrow(
		token.burn(10001, {from: accounts[5]})
	);
  });
});