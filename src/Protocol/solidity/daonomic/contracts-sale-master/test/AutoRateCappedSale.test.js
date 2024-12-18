const util = require('util');
const BN = web3.utils.BN;

const Sale = artifacts.require("SimpleAutoRateCappedSale.sol");
const Token = artifacts.require("ERC20Mintable.sol");

const tests = require("@daonomic/tests-common");
const assertEq = tests.assertEq;
const verifyBalanceChange = tests.verifyBalanceChange;
const expectThrow = tests.expectThrow;
const randomAddress = tests.randomAddress;
const increaseTime = tests.increaseTime;

const decimals = new BN("1000000000000000000");

function bn(v) {
    return new BN(v);
}

function tokens(amount) {
  return decimals.mul(new BN(amount));
}

contract('AutoRateCappedSale', accounts => {
  let token;
  let paymentToken;
  let sale;

  beforeEach(async () => {
    token = await Token.new();
    paymentToken = await Token.new();
    sale = await Sale.new(token.address);

    await token.addMinter(sale.address);
    await sale.addOperator(accounts[9]);
  });

  it("should sell 1200 tokens for 1 ETH and return nothing", async () => {
    await verifyBalanceChange(accounts[0], tokens(1), () => sale.sendTransaction({value: tokens(1), gasPrice: 0}));

    assertEq(await token.balanceOf(accounts[0]), tokens(1200))
  });

  it("should sell 2000 tokens for 10 ETH and return change", async () => {
    await verifyBalanceChange(accounts[0], "1666666666666666600", () => sale.sendTransaction({value: tokens(10), gasPrice: 0}));
    assertEq(await token.balanceOf(accounts[0]), tokens(2000))
  });

  it("should sell 20 tokens for 1 BTC and log change", async () => {
    var tx = await sale.onReceive(accounts[1], "0x0000000000000000000000000000000000000002", "100000000", "0xffffff", {from: accounts[9]});
    assertEq(await token.balanceOf(accounts[1]), tokens(2000))

    var event = tests.findLog(tx, "Change");
    assert.equal(event.args.token, "0x0000000000000000000000000000000000000002");
    assertEq(event.args.value, 94285715);
  });
});