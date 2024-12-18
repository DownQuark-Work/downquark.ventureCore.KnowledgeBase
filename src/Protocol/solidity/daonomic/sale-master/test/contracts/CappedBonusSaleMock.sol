pragma solidity ^0.5.0;

import "@daonomic/util/contracts/OwnableImpl.sol";
import "../../contracts/OneRateSale.sol";
import "../../contracts/LoggingSale.sol";
import "../../contracts/CappedBonusSale.sol";
import "@daonomic/util/contracts/SecuredImpl.sol";


contract CappedBonusSaleMock is OwnableImpl, SecuredImpl, OneRateSale, LoggingSale, CappedBonusSale {
    constructor(uint256 _cap, address _token, uint256 _rate, uint256 _bonus) OneRateSale(_token, _rate, _bonus) CappedBonusSale(_cap) public {

    }
}
