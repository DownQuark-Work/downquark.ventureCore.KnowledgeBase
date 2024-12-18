var TokenMock = artifacts.require('ReceiveNotifyTokenMock.sol');
var ReceiverMock = artifacts.require('TokenReceiverMock.sol');

const tests = require("@daonomic/tests-common");

contract("ReceiveNotifyTokenImpl", function(accounts) {
    let token;
    let receiver;

    beforeEach(async function() {
        token = await TokenMock.new(accounts[0], 100);
        receiver = await ReceiverMock.new();
    });

    it("should notify receiver", async () => {
        var tx = await token.transferAndCall(receiver.address, 50, "0xffffff");
        var event = tests.findLog(tx, "EventTokenTransfer");
        assert.equal(event.args.from, accounts[0]);
        assert.equal(event.args.value, 50);
    });


});


