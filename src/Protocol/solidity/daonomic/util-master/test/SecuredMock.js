var Secured = artifacts.require("SecuredMock.sol")
var tests = require('@daonomic/tests-common');
var expectThrow = tests.expectThrow;
var randomAddress = tests.randomAddress;

contract('SecuredImpl', function(accounts) {
  let secured;

  beforeEach(async function() {
    secured = await Secured.new();
  });

  async function initRoles(secured) {
    await secured.transferRole("user", accounts[1]);
    await secured.transferRole("operator", accounts[2]);
    assert.equal(await secured.getRole("user"), accounts[1]);
  }

  it('should let invoke action1 only to operator', async function() {
    await initRoles(secured);
    await secured.action1({from: accounts[2]});
    await expectThrow(
        secured.action1({from: accounts[1]})
    );
    await expectThrow(
        secured.action1({from: accounts[0]})
    );
    await expectThrow(
        secured.action1({from: accounts[3]})
    );
  });

  it('should let invoke action2 only to user', async function() {
    await initRoles(secured);
    await secured.action2({from: accounts[1]});
    await expectThrow(
        secured.action2({from: accounts[2]})
    );
    await expectThrow(
        secured.action2({from: accounts[0]})
    );
    await expectThrow(
        secured.action2({from: accounts[3]})
    );
  });

  it('should let invoke action3 only to owner or user', async function() {
    await initRoles(secured);
    await secured.action3({from: accounts[1]});
    await secured.action3({from: accounts[0]});
    await expectThrow(
        secured.action3({from: accounts[2]})
    );
    await expectThrow(
        secured.action3({from: accounts[3]})
    );
  });

  it('should let invoke action4 only to user or operator', async function() {
    await initRoles(secured);
    await secured.action4({from: accounts[1]});
    await secured.action4({from: accounts[2]});
    await expectThrow(
        secured.action4({from: accounts[0]})
    );
    await expectThrow(
        secured.action4({from: accounts[3]})
    );
  });

  it('should not let others change roles', async function() {
    var address = randomAddress();

    await expectThrow(
        secured.transferRole("user", address, {from: accounts[1]})
    );
  });
});