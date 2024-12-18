pragma solidity ^0.5.0;


import "@daonomic/util/contracts/OwnableImpl.sol";
import "./OneRateSale.sol";
import "./LoggingSale.sol";
import "@daonomic/util/contracts/SecuredImpl.sol";


contract OneRateLoggingSale is OwnableImpl, SecuredImpl, OneRateSale, LoggingSale {
    constructor(address _token, uint256 _rate, uint256 _bonus) OneRateSale(_token, _rate, _bonus) public {

    }
}
