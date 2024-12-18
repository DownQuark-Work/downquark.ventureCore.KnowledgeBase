pragma solidity ^0.4.21;


import './ReceiveAdapter.sol';
import '@daonomic/interfaces/contracts/TokenReceiver.sol';

/**
 * @dev Helps to receive ERC223-complaint tokens. ERC223 Token contract should notify receiver.
 */
contract ERC223ReceiveAdapter is TokenReceiver, ReceiveAdapter {
    function tokenFallback(address _from, uint256 _value, bytes _data) public {
        onReceive(msg.sender, _from, _value, _data);
    }

    function onTokenTransfer(address _from, uint256 _value, bytes _data) public {
        onReceive(msg.sender, _from, _value, _data);
    }
}