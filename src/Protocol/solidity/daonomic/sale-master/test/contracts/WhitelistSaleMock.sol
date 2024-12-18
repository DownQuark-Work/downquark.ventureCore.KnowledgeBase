pragma solidity ^0.5.0;


import "@daonomic/util/contracts/OwnableImpl.sol";
import "@daonomic/util/contracts/SecuredImpl.sol";
import "../../contracts/OneRateSale.sol";
import "../../contracts/LoggingSale.sol";
import "../../contracts/WhitelistSale.sol";


contract WhitelistSaleMock is OwnableImpl, SecuredImpl, OneRateSale, LoggingSale, WhitelistSale {
	constructor(address _token, uint256 _rate, uint256 _bonus, Whitelist[] memory _whitelists) WhitelistSale(_whitelists) OneRateSale(_token, _rate, _bonus) public {

	}
}
