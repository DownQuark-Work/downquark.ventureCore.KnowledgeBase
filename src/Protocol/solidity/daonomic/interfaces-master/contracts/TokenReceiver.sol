pragma solidity ^0.5.0;

/**
 * @title ERC223 TokenReceiver interface
 * @dev see https://github.com/ethereum/EIPs/issues/223
 */
contract TokenReceiver {
    function onTokenTransfer(address _from, uint256 _value, bytes memory _data) public;
}