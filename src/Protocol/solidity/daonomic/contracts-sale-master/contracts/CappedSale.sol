pragma solidity ^0.5.0;


import "./CountingTotalSale.sol";


contract CappedSale is Ownable, Events, Sale, CountingTotalSale {
    uint public cap;

    constructor(uint _cap) public {
        cap = _cap;
    }

    function _postValidatePurchase(address _beneficiary, address _token, uint _value, uint _purchased, uint _bonus, uint _extraBonus) internal {
        super._postValidatePurchase(_beneficiary, _token, _value, _purchased, _bonus, _extraBonus);
        require(purchasedTotal + bonusTotal < cap);
    }
}
