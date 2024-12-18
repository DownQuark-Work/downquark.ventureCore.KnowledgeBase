const Sale = artifacts.require("SimpleReferralBonusSale.sol");
const Token = artifacts.require("ERC20Mintable.sol");
const util = require('util');

const tests = require("@daonomic/tests-common");
const expectThrow = tests.expectThrow;
const randomAddress = tests.randomAddress;
const verifyBalanceChange = tests.verifyBalanceChange;
const increaseTime = tests.increaseTime;

contract('ReferralBonusCrowdsale', accounts => {
  let token;
  let sale;

  beforeEach(async () => {
    token = await Token.new();
    sale = await Sale.new(token.address, 100, 50);

    await token.addMinter(sale.address);
  });

  it("should not sell if not whitelisted", async () => {
    await expectThrow(
        sale.sendTransaction({value: 100, from: accounts[1]})
    );
  });

  it("should sell if whitelisted", async () => {
    var tx = await sale.setReferrer(accounts[1], "0x0000000000000000000000000000000000000001");
    assert(tests.findLog(tx, "WhitelistChange") != null);
    var tx = await sale.sendTransaction({value: 100, from: accounts[1]});
    console.log(tx.receipt.gasUsed);
    var purchase = tests.findLog(tx, "Purchase");
    assert.equal(purchase.args.purchased, 1000);
    assert.equal(purchase.args.beneficiary, accounts[1]);
    assert.equal(purchase.args.paid, 100);
    assert.equal(await token.balanceOf(accounts[1]), 1000);
  });

  it("should not let set referrer to someone who's not whitelisted", async () => {
    await expectThrow(
        sale.setReferrer(accounts[1], accounts[2])
    );

    sale.setReferrer(accounts[2], "0x0000000000000000000000000000000000000001");
    await sale.setReferrer(accounts[1], accounts[2]);
  });

  it("should calculate bonuses and deliver tokens", async () => {
    sale.setReferrer(accounts[2], "0x0000000000000000000000000000000000000001");
    await sale.setReferrer(accounts[1], accounts[2]);

    var tx = await sale.sendTransaction({value: 100, from: accounts[1]});
    console.log(tx.receipt.gasUsed);
    assert.equal(await token.balanceOf(accounts[1]), 1050);
    assert.equal(await token.balanceOf(accounts[2]), 100);

    var bonuses = tests.findLog(tx, "Bonus");
    assert.equal(bonuses.length, 2);
    assert.equal(bonuses[0].args.amount, 50);
    assert.equal(bonuses[0].args.beneficiary, accounts[1]);
    assert.equal(bonuses[0].args.bonusType, 3);
    assert.equal(bonuses[1].args.amount, 100);
    assert.equal(bonuses[1].args.beneficiary, accounts[2]);
    assert.equal(bonuses[1].args.bonusType, 2);
  });
});