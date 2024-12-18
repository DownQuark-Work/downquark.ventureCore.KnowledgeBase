pragma solidity ^0.4.21;

import './ReceiveAdapter.sol';


contract TestReceiveAdapter is ReceiveAdapter {
    event Receive(address token, address from, uint256 value, bytes data);

    function onReceive(address _token, address _from, uint256 _value, bytes _data) internal {
        emit Receive(_token, _from, _value, _data);
    }
}