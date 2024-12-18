pragma solidity ^0.5.0;


import "./AbstractSale.sol";
import "@daonomic/interfaces/contracts/Whitelist.sol";


contract WhitelistSale is AbstractSale {
	Whitelist[] public whitelists;

	constructor(Whitelist[] memory _whitelists) public {
		whitelists = _whitelists;
	}

	function checkPurchaseValid(address buyer, uint256 sold, uint256 bonus) internal {
		super.checkPurchaseValid(buyer, sold, bonus);
		require(canBuy(buyer), "investor is not whitelisted");
	}

	function canBuy(address _address) view public returns (bool) {
		for (uint i = 0; i < whitelists.length; i++) {
			if (whitelists[i].isInWhitelist(_address)) {
				return true;
			}
		}
		return false;
	}

	function getWhitelists() view public returns (Whitelist[] memory) {
		return whitelists;
	}

	function setWhitelists(Whitelist[] memory _whitelists) onlyOwner public {
		whitelists = _whitelists;
	}
}
