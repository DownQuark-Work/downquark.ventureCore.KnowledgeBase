pragma solidity ^0.4.21;


import '@daonomic/interfaces/contracts/Token.sol';
import './ReceiveAdapter.sol';

/**
 * @dev Helps to receive ERC20-complaint tokens. Owner should call token.approve first
 */
contract ERC20ReceiveAdapter is ReceiveAdapter {
    function receive(address _token, uint256 _value, bytes _data) public {
        Token token = Token(_token);
        token.transferFrom(msg.sender, this, _value);
        onReceive(_token, msg.sender, _value, _data);
    }
}