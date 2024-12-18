const util = require('util');
const BN = web3.utils.BN;

const Sale = artifacts.require("SimpleCustomRateSale.sol");
const Token = artifacts.require("ERC20Mintable.sol");

const tests = require("@daonomic/tests-common");
const expectThrow = tests.expectThrow;
const randomAddress = tests.randomAddress;
const verifyBalanceChange = tests.verifyBalanceChange;
const assertEq = tests.assertEq;
const increaseTime = tests.increaseTime;

const decimals = new BN("1000000000000000000");

contract('CustomRateSale', accounts => {
  let token;
  let paymentToken;
  let sale;

  function tokens(amount) {
    return decimals.mul(new BN(amount));
  }

  beforeEach(async () => {
    token = await Token.new();
    paymentToken = await Token.new();
    sale = await Sale.new(token.address);

    await token.addMinter(sale.address);
    await sale.addOperator(accounts[9]);
    await sale.setConversionRate("0x0000000000000000000000000000000000000000", "0x0000000000000000000000000000000000000001", tokens(120));
  });

  it("should sell 1100 tokens for 1 ETH", async () => {
    var tx = await sale.sendTransaction({value: tokens(1)});
    console.log(tx.receipt.gasUsed);
    assertEq(await token.balanceOf(accounts[0]), tokens(1200))
  });

  it("should sell 1200 * 10**18 tokens for 1 * 10**18 ETH", async () => {
    var tx = await sale.sendTransaction({value: tokens(tokens(1))});
    console.log(tx.receipt.gasUsed);
    assertEq(await token.balanceOf(accounts[0]), tokens(tokens(1200)))
  });

  it("should sell 1200 wei of tokens for 1 wei", async () => {
    var tx = await sale.sendTransaction({value: 1});
    console.log(tx.receipt.gasUsed);
    assertEq(await token.balanceOf(accounts[0]), 1200);
  });

  it("should not sell for BTC if conversion rate not set", async () => {
    await expectThrow(
        sale.onReceive(accounts[1], "0x0000000000000000000000000000000000000002", "100000000", "0xffffff", {from: accounts[9]})
    );

    await sale.setConversionRate("0x0000000000000000000000000000000000000002", "0x0000000000000000000000000000000000000001", tokens(1000));

    var tx = await sale.onReceive(accounts[1], "0x0000000000000000000000000000000000000002", "100000000", "0xffffff", {from: accounts[9]});
    console.log(tx.receipt.gasUsed);
    assertEq(await token.balanceOf(accounts[1]), tokens(10000))
  });

});