pragma solidity ^0.5.0;


import './Token.sol';


/**
 * @title ERC223 interface. Notifies receiving contract about incoming tokens.
 * @dev see https://github.com/ethereum/EIPs/issues/223
 */

contract NotifyingToken is Token {
    event Transfer(address indexed from, address indexed to, uint256 value, bytes data);

    function transferAndCall(address _to, uint256 _value, bytes memory _data) public returns (bool);
}