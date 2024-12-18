pragma solidity ^0.5.0;

import "./Ownable.sol";

/**
 * @title Secured
 * @dev Adds only(role) modifier. Subcontracts should implement checkRole to check if caller is allowed to do action.
 */
contract Secured is Ownable {
    modifier only(string memory role) {
        require(msg.sender == getRole(role));
        _;
    }

    modifier ownerOr(string memory role) {
        bool roleMatches = msg.sender == getRole(role);
        if (!roleMatches) {
            checkOwner(msg.sender);
        }
        _;
    }

    modifier any(string memory role1, string memory role2) {
        require(msg.sender == getRole(role1) || msg.sender == getRole(role2));
        _;
    }

    function getRole(string memory role) view public returns (address);
}
