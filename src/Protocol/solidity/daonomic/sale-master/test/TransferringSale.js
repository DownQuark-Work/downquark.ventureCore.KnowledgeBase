var Sale = artifacts.require('TransferringSaleMock.sol');
var Token = artifacts.require('MintableTokenMock.sol');

const tests = require("@daonomic/tests-common");
const awaitEvent = tests.awaitEvent;
const expectThrow = tests.expectThrow;
const randomAddress = tests.randomAddress;

var BN = web3.utils.BN;
function bn(v) {
    return new BN(v);
}

contract("TransferringSale", accounts => {
  let token;

  beforeEach(async function() {
    token = await Token.new();
  });

  it("should transfer if user sends ether", async () => {
    var sale = await Sale.new(token.address, "0x0000000000000000000000000000000000000000", bn("10000000000000000000"), 0);
    await token.mint(sale.address, bn("10000000000000000"));

    await sale.sendTransaction({from: accounts[1], value: 5});
    assert.equal(await token.totalSupply(), 10000000000000000);
    assert.equal(await token.balanceOf(accounts[1]), 50);

    await sale.sendTransaction({from: accounts[2], value: 50});
    assert.equal(await token.totalSupply(), 10000000000000000);
    assert.equal(await token.balanceOf(accounts[2]), 500);
  });

  it("should transfer to other user if requested", async () => {
    var sale = await Sale.new(token.address, "0x0000000000000000000000000000000000000000", bn("10000000000000000000"), 0);
    await token.mint(sale.address, bn("10000000000000000"));

	var beneficiary = randomAddress();
    await sale.buyTokens(beneficiary, {from: accounts[1], value: 5});
    assert.equal(await token.totalSupply(), 10000000000000000);
    assert.equal(await token.balanceOf(beneficiary), 50);
  });

});
