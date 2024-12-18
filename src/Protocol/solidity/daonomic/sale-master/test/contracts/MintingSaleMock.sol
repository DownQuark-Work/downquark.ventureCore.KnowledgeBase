pragma solidity ^0.5.0;


import "@daonomic/util/contracts/OwnableImpl.sol";
import "../../contracts/OneRateSale.sol";
import "../../contracts/MintingSale.sol";
import "@daonomic/util/contracts/SecuredImpl.sol";


contract MintingSaleMock is OwnableImpl, SecuredImpl, OneRateSale, MintingSale {
    constructor(address _mintableToken, address _token, uint256 _rate, uint256 _bonus) OneRateSale(_token, _rate, _bonus) MintingSale(_mintableToken) public {

    }
}
