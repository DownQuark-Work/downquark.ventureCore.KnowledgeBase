pragma solidity ^0.5.0;

import "./Sale.sol";

contract PeriodSale is Ownable, Events, Sale {
    uint256 public start;
    uint256 public end;

    constructor(uint256 _start, uint256 _end) public {
        start = _start;
        end = _end;
    }

    function _preValidatePurchase(address _beneficiary, address _token, uint _value) view internal {
        super._preValidatePurchase(_beneficiary, _token, _value);
        require(now > start && now < end);
    }
}
