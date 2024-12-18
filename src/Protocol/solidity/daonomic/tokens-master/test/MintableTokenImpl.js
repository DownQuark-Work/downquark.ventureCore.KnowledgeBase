var MintableTokenMock = artifacts.require("MintableTokenMock.sol");

const tests = require("@daonomic/tests-common");
const expectThrow = tests.expectThrow;

contract('MintableTokenImpl', function(accounts) {

  let token;

  beforeEach(async function() {
    token = await MintableTokenMock.new();
  });

  it("should have totalSupply = 0", async () => {
    let totalSupply = await token.totalSupply();
    assert.equal(totalSupply, 0);
  })

  it("should let minter mint", async () => {
    var address = tests.randomAddress();

    await token.transferRole("minter", accounts[1]);
    await token.mint(address, 100, {from: accounts[1]});
    assert.equal(await token.totalSupply(), 100);
    assert.equal(await token.balanceOf(address), 100);
  });

  it("should throw if not owner", async () => {
    var address = tests.randomAddress();

    await token.transferRole("minter", accounts[1]);
    await expectThrow(
        token.mint(address, 100, {from: accounts[2]})
    );
  });
});