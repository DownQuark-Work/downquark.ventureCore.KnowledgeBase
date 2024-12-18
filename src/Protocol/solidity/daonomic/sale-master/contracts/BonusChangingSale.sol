pragma solidity ^0.5.0;

import "./AbstractSale.sol";

contract BonusChangingSale is AbstractSale {
	event BonusChange(uint256 bonus);
	uint256 public bonus;

	function getBonuses(uint256 sold) view internal returns (BonusItem[] memory) {
		BonusItem[] memory result = new BonusItem[](1);
		result[0] = BonusItem(sold.mul(bonus).div(100), BonusType.OTHER);
		return result;
	}

	function setBonus(uint256 _bonus) onlyOwner public {
		bonus = _bonus;
		emit BonusChange(_bonus);
	}
}
