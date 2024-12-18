const Sale = artifacts.require("SimpleMintingSale.sol");
const Token = artifacts.require("ERC20Mintable.sol");
const util = require('util');

const tests = require("@daonomic/tests-common");
const expectThrow = tests.expectThrow;
const randomAddress = tests.randomAddress;
const verifyBalanceChange = tests.verifyBalanceChange;
const increaseTime = tests.increaseTime;

contract('SimpleMintableTokenCrowdsale', accounts => {
  let token;
  let paymentToken;
  let sale;

  beforeEach(async () => {
    token = await Token.new();
    paymentToken = await Token.new();
    sale = await Sale.new(token.address);
    await sale.setRate("0x0000000000000000000000000000000000000000", 10);
    await sale.setRate(paymentToken.address, 100);

    await token.addMinter(sale.address);
  });

  it("should sell to provided beneficiary", async () => {
    var tx = await sale.buyTokens(accounts[1], {value: 100});
    console.log(tx.receipt.gasUsed);
    var purchase = tests.findLog(tx, "Purchase");
    assert.equal(purchase.args.purchased, 1000);
    assert.equal(purchase.args.beneficiary, accounts[1]);
    assert.equal(purchase.args.paid, 100);
    assert.equal(await token.balanceOf(accounts[1]), 1000);
  });

  it("should sell in exchange to payment tokens", async () => {
    await paymentToken.mint(accounts[0], 100);
    await paymentToken.approve(sale.address, 100);

    var tx = await sale.receiveERC20(accounts[1], paymentToken.address, 100);
    console.log(tx.receipt.gasUsed);
    var purchase = tests.findLog(tx, "Purchase");
    assert.equal(purchase.args.purchased, 10000);
    assert.equal(purchase.args.beneficiary, accounts[1]);
    assert.equal(purchase.args.paid, 100);
    assert.equal(await token.balanceOf(accounts[1]), 10000);
  });

  it("should not sell if rate is 0", async () => {
    await sale.setRate("0x0000000000000000000000000000000000000000", 0);

    await expectThrow(
        sale.buyTokens(accounts[1], {value: 100})
    );
  });
});