var MintingSaleMock = artifacts.require('MintingSaleMock.sol');
var MintableToken = artifacts.require('MintableTokenMock.sol');

const tests = require("@daonomic/tests-common");
const expectThrow = tests.expectThrow;
const randomAddress = tests.randomAddress;

var BN = web3.utils.BN;
function bn(v) {
    return new BN(v);
}

contract("MintingSale", accounts => {
  let token;

  beforeEach(async function() {
    token = await MintableToken.new();
  });

  it("should mint if user sends ether", async () => {
    var sale = await MintingSaleMock.new(token.address, "0x0000000000000000000000000000000000000000", bn("10000000000000000000"), 0);
    await token.transferRole("minter", sale.address);

    await sale.sendTransaction({from: accounts[1], value: 5});
    assert.equal(await token.totalSupply(), 50);
    assert.equal(await token.balanceOf(accounts[1]), 50);

    await sale.sendTransaction({from: accounts[2], value: 50});
    assert.equal(await token.totalSupply(), 550);
    assert.equal(await token.balanceOf(accounts[2]), 500);
  });

  it("should mint to other user if requested", async () => {
    var sale = await MintingSaleMock.new(token.address, "0x0000000000000000000000000000000000000000", bn("10000000000000000000"), 0);
    await token.transferRole("minter", sale.address);

	var beneficiary = randomAddress();
    await sale.buyTokens(beneficiary, {from: accounts[1], value: 5});
    assert.equal(await token.totalSupply(), 50);
    assert.equal(await token.balanceOf(beneficiary), 50);
  });

});
