pragma solidity ^0.5.0;

import "./Sale.sol";

contract CountingTotalSale is Ownable, Events, Sale {
    uint public purchasedTotal;
    uint public bonusTotal;

    function _updateState(address _beneficiary, address _token, uint _value, uint _purchased, uint _bonus, uint _extraBonus) internal {
        super._updateState(_beneficiary, _token, _value, _purchased, _bonus, _extraBonus);
        purchasedTotal += _purchased;
        bonusTotal += _bonus + _extraBonus;
    }
}
