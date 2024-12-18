var TokenMock = artifacts.require('ERC223Mock.sol');
var AdapterMock = artifacts.require('ERC223ReceiveAdapterMock.sol');

const verifyReceiveAdapter = require('./helpers/verifyReceiveAdapter');

contract('ERC223ReceiveAdapter', function(accounts) {
  it("should receive tokens", async function() {
    await verifyReceiveAdapter(accounts[0], TokenMock, AdapterMock, async (token, receiver, value, data) => {
        await token.transferAndCall(receiver.address, value, data);
    });
  });
});
