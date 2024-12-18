pragma solidity ^0.5.0;

import "@daonomic/interfaces/contracts/RestrictingService.sol";

contract DenyRestrictingService is RestrictingService {
    function onTransfer(address _from, address _to, uint _amount) public returns (bool) {
        return false;
    }
}
