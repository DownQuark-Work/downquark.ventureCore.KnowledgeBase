pragma solidity ^0.5.0;


import "./AbstractSale.sol";


contract PeriodSale is AbstractSale {
	uint256 public start;
	uint256 public end;

	constructor(uint256 _start, uint256 _end) public {
		start = _start;
		end = _end;
	}

	function checkPurchaseValid(address buyer, uint256 sold, uint256 bonus) internal {
		super.checkPurchaseValid(buyer, sold, bonus);
		require(now > start && now < end);
	}
}
