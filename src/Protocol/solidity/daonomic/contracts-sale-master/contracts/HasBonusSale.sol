pragma solidity ^0.5.0;


import "./Sale.sol";


contract HasBonusSale is Ownable, Events, Sale {

    function getBonus(address _beneficiary, uint _amount) public view returns (uint result) {
        (BonusItem[] memory bonuses,) = _getBonuses(_beneficiary, _amount);
        for (uint i = 0; i < bonuses.length; i++) {
            result += bonuses[i].amount;
        }
    }

    function _createOneBonus(uint amount, BonusType bonusType) pure internal returns (BonusItem[] memory result) {
        result = new BonusItem[](1);
        result[0] = BonusItem(amount, bonusType);
    }

    function _addOneBonus(BonusItem[] memory items, uint amount, BonusType bonusType) pure internal returns (BonusItem[] memory result) {
        result = new BonusItem[](items.length + 1);
        for (uint i = 0; i < items.length; i++) {
            result[i] = items[i];
        }
        result[items.length] = BonusItem(amount, bonusType);
    }

    function _createOneExtraBonus(address beneficiary, BonusItem[] memory items) pure internal returns (ExtraBonus[] memory result) {
        result = new ExtraBonus[](1);
        result[0] = ExtraBonus(beneficiary, items);
    }

    function _addOneExtraBonus(ExtraBonus[] memory extras, address beneficiary, BonusItem[] memory items) pure internal returns (ExtraBonus[] memory result) {
        result = new ExtraBonus[](extras.length + 1);
        for (uint i = 0; i < extras.length; i++) {
            result[i] = extras[i];
        }
        result[extras.length] = ExtraBonus(beneficiary, items);
    }
}
