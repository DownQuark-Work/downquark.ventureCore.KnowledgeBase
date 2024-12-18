pragma solidity ^0.5.0;


import '@daonomic/interfaces/contracts/TokenReceiver.sol';


contract TokenReceiverMock is TokenReceiver {
    event EventTokenTransfer(address from, uint256 value);

    function onTokenTransfer(address _from, uint256 _value, bytes memory _data) public {
        emit EventTokenTransfer(_from, _value);
    }
}
