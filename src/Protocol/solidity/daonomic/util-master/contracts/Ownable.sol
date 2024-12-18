pragma solidity ^0.5.0;

/**
 * @title Ownable
 * @dev Adds onlyOwner modifier. Subcontracts should implement checkOwner to check if caller is owner.
 */
contract Ownable {
    modifier onlyOwner() {
        checkOwner(msg.sender);
        _;
    }

    function checkOwner(address _address) public;
}
