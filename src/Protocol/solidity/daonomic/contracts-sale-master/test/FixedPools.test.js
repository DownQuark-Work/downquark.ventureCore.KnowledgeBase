const Pools = artifacts.require("SimpleFixedPools.sol");
const Token = artifacts.require("ERC20Mintable.sol");
const TokenHolder = artifacts.require("TokenHolder.sol");
const util = require('util');

const tests = require("@daonomic/tests-common");
const expectThrow = tests.expectThrow;
const randomAddress = tests.randomAddress;
const verifyBalanceChange = tests.verifyBalanceChange;
const increaseTime = tests.increaseTime;
const sleep = require('sleep-promise');

contract('FixedPools', accounts => {
  let token;
  let pools;

  beforeEach(async () => {
    token = await Token.new();
  });

  it("should make direct transfer when using direct pool", async () => {
    var pools = await Pools.new(token.address, 1);
    await token.addMinter(pools.address);

    var tx = await pools.createHolder("Direct", accounts[1], 1000);
    console.log(tx.receipt.gasUsed);

    assert.equal(await token.balanceOf(accounts[1]), 1000);
  });

  it("should make direct transfer when release time is in past", async () => {
    var pools = await Pools.new(token.address, 1);
    await token.addMinter(pools.address);

    var tx = await pools.createHolder("Fixed", accounts[1], 1000);
    console.log(tx.receipt.gasUsed);

    assert.equal(await token.balanceOf(accounts[1]), 1000);
  });

  it("should create holder if time is in future", async () => {
    var pools = await Pools.new(token.address, parseInt(new Date().getTime() / 1000) + 1);
    await token.addMinter(pools.address);

    var tx = await pools.createHolder("Fixed", accounts[1], 1000);
    console.log(tx.receipt.gasUsed);

    var event = tests.findLog(tx, "TokenHolderCreatedEvent");
    var holder = await TokenHolder.at(event.args.holder);

    await expectThrow(
        holder.release({from: accounts[1]})
    );

    await sleep(2000);
    var tx2 = await holder.release({from: accounts[1]});
    console.log(tx2.receipt.gasUsed);

    assert.equal(await token.balanceOf(accounts[1]), 1000);
  });

});