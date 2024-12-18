var Sale = artifacts.require('SimpleMintingSale.sol');
const Token = artifacts.require("ERC20Mintable.sol");
var KyberNetworkWrapper = artifacts.require('KyberNetworkWrapper.sol');
var TestKyberNetwork = artifacts.require('TestKyberNetwork.sol');

const tests = require("@daonomic/tests-common");
const expectThrow = tests.expectThrow;
const randomAddress = tests.randomAddress;

var BN = web3.utils.BN;
function bn(v) {
    return new BN(v);
}

contract("KyberNetworkWrapper", accounts => {
  let token;
  let dai;
  let wbtc;
  let sale;
  let kyber;
  let wrapper;

  beforeEach(async function() {
    token = await Token.new();
    dai = await Token.new();
    wbtc = await Token.new();
    kyber = await TestKyberNetwork.new(dai.address, wbtc.address);
    await dai.mint(accounts[1], 10000);
    await wbtc.mint(accounts[1], 10000);
    await dai.mint(kyber.address, "100000000000000000000000000000000000000");
    await wbtc.mint(kyber.address, "100000000000000000000000000000000000000");
    await kyber.sendTransaction({from: accounts[5], value: 100000000});

    sale = await Sale.new(token.address);
    await token.addMinter(sale.address);

    await sale.setRate("0x0000000000000000000000000000000000000000", 10);
    await sale.setRate(dai.address, 100);
    await sale.setRate(wbtc.address, 1);

    wrapper = await KyberNetworkWrapper.new();
  });

  it("should exchange erc20 to eth", async () => {
    await dai.approve(wrapper.address, 10000, {from: accounts[1]});

    await wrapper.tradeAndBuy(kyber.address, sale.address, dai.address, 10000, "0x0000000000000000000000000000000000000000", 0, 0, accounts[5], {from: accounts[1]});

    assert.equal(await token.totalSupply(), 540);
    assert.equal(await token.balanceOf(accounts[5]), 540);
    assert.equal((await dai.balanceOf(wrapper.address)).toNumber(), 0);
    assert.equal((await dai.balanceOf(sale.address)).toNumber(), 0);
    assert.equal((await dai.balanceOf(accounts[1])).toNumber(), 48);
  });

  it("should exchange eth to erc20", async () => {
    await wrapper.tradeAndBuy(kyber.address, sale.address, "0x0000000000000000000000000000000000000000", 10000, dai.address, 0, 0, accounts[5], {from: accounts[1], value: 10000});

    assert.equal((await token.totalSupply()).toNumber(), 183941000);
    assert.equal((await token.balanceOf(accounts[5])).toNumber(), 183941000);
    assert.equal((await dai.balanceOf(sale.address)).toNumber(), 1839410);
  });

  it("should exchange erc20 to erc20", async () => {
    await dai.approve(wrapper.address, 10000, {from: accounts[1]});

    await wrapper.tradeAndBuy(kyber.address, sale.address, dai.address, 10000, wbtc.address, 0, 0, accounts[5], {from: accounts[1]});

    assert.equal(await token.totalSupply(), 1);
    assert.equal(await token.balanceOf(accounts[5]), 1);
    assert.equal((await dai.balanceOf(wrapper.address)).toNumber(), 0);
    assert.equal((await wbtc.balanceOf(sale.address)).toNumber(), 1);
    assert.equal((await dai.balanceOf(accounts[1])).toNumber(), 4628);
  });

});
