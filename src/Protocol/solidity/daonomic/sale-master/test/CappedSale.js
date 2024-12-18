var CappedSale = artifacts.require('CappedSaleMock.sol');

const tests = require("@daonomic/tests-common");
const expectThrow = tests.expectThrow;
const randomAddress = tests.randomAddress;

var BN = web3.utils.BN;
function bn(v) {
    return new BN(v);
}

contract("CappedSale", accounts => {

  it("should let buy if cap not reached", async () => {

    var sale = await CappedSale.new(100, "0x0000000000000000000000000000000000000000", bn("10000000000000000000"), 0);

    var tx = await sale.sendTransaction({from: accounts[1], value: 5});
    var purchase = tests.findLog(tx, "Purchase");
    assert.equal(purchase.args.buyer, accounts[1]);
    assert.equal(purchase.args.value, 5);
    assert.equal(purchase.args.sold, 50);
    assert.equal(purchase.args.token, "0x0000000000000000000000000000000000000000");
  });

  it("should throw if cap reached", async () => {
    var sale = await CappedSale.new(100, "0x0000000000000000000000000000000000000000", bn("10000000000000000000"), 0);

    await expectThrow(
        sale.sendTransaction({from: accounts[1], value: 11})
    );
    await sale.sendTransaction({from: accounts[1], value: 5});
    await sale.sendTransaction({from: accounts[1], value: 5});
    await expectThrow(
        sale.sendTransaction({from: accounts[1], value: 1})
    );
  });

  it("should not take bonus into account", async () => {
    var sale = await CappedSale.new(100, "0x0000000000000000000000000000000000000000", bn("10000000000000000000"), 100);
    var Purchase = sale.Purchase({});

    var tx = await sale.sendTransaction({from: accounts[1], value: 10});
    var purchase = tests.findLog(tx, "Purchase");
    assert.equal(purchase.args.buyer, accounts[1]);
    assert.equal(purchase.args.value, 10);
    assert.equal(purchase.args.sold, 100);
    assert.equal(purchase.args.bonus, 100);
    assert.equal(purchase.args.token, 0);
    await expectThrow(
        sale.sendTransaction({from: accounts[1], value: 1})
    );
  });

});
