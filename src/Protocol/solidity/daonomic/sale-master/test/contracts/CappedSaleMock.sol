pragma solidity ^0.5.0;

import "@daonomic/util/contracts/OwnableImpl.sol";
import "../../contracts/OneRateSale.sol";
import "../../contracts/LoggingSale.sol";
import "../../contracts/CappedSale.sol";
import "@daonomic/util/contracts/SecuredImpl.sol";


contract CappedSaleMock is OwnableImpl, SecuredImpl, OneRateSale, LoggingSale, CappedSale {
    constructor(uint256 _cap, address _token, uint256 _rate, uint256 _bonus) OneRateSale(_token, _rate, _bonus) CappedSale(_cap) public {

    }
}
