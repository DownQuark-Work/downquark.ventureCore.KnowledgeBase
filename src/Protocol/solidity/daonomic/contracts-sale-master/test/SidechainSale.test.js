const Sale = artifacts.require("SimpleSidechainSale.sol");
const Token = artifacts.require("ERC20Mintable.sol");
const util = require('util');

const tests = require("@daonomic/tests-common");
const expectThrow = tests.expectThrow;
const randomAddress = tests.randomAddress;
const verifyBalanceChange = tests.verifyBalanceChange;
const increaseTime = tests.increaseTime;

contract('SidechainSale', accounts => {
  let token;
  let sale;

  beforeEach(async () => {
    token = await Token.new();
    sale = await Sale.new(token.address);

    await sale.setRate("0x0000000000000000000000000000000000000001", 10);
    await sale.addOperator(accounts[9]);
    await token.addMinter(sale.address);
  });

  it("should sell tokens if operator notifies contract", async () => {
    var tx = await sale.onReceive(accounts[1], "0x0000000000000000000000000000000000000001", 100, "0xffffff", {from: accounts[9]});
    console.log(tx.receipt.gasUsed);
    var purchase = tests.findLog(tx, "Purchase");
    assert.equal(purchase.args.purchased, 1000);
    assert.equal(purchase.args.beneficiary, accounts[1]);
    assert.equal(purchase.args.paid, 100);
    assert.equal(await token.balanceOf(accounts[1]), 1000);
  });

  it("should not sell tokens if not operator", async () => {
    await expectThrow(
      sale.onReceive(accounts[1], "0x0000000000000000000000000000000000000001", 100, "0xffffff", {from: accounts[1]})
    );
  });

});