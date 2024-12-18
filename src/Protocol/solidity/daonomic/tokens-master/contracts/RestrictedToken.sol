pragma solidity ^0.5.0;

import "./TokenImpl.sol";
import "@daonomic/interfaces/contracts/RestrictingService.sol";
import "@daonomic/util/contracts/Ownable.sol";

contract RestrictedToken is Ownable, TokenImpl {
    RestrictingService public restrictingService;

    constructor(RestrictingService _restrictingService) public {
        restrictingService = _restrictingService;
    }

    function setRestrictingService(RestrictingService _restrictingService) onlyOwner public {
        restrictingService = _restrictingService;
    }

    function transfer(address _to, uint256 _value) public returns (bool) {
        require(restrictingService.onTransfer(msg.sender, _to, _value), "RestrictingService prohibits transfer");
        super.transfer(_to, _value);
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool) {
        require(restrictingService.onTransfer(_from, _to, _value), "RestrictingService prohibits transfer");
        super.transferFrom(_from, _to, _value);
    }
}
