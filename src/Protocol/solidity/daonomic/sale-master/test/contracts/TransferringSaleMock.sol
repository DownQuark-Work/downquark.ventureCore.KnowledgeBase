pragma solidity ^0.5.0;


import "@daonomic/util/contracts/OwnableImpl.sol";
import "@daonomic/util/contracts/SecuredImpl.sol";
import "../../contracts/OneRateSale.sol";
import "../../contracts/TransferringSale.sol";


contract TransferringSaleMock is OwnableImpl, SecuredImpl, OneRateSale, TransferringSale {
    constructor(BasicToken _basicToken, address _token, uint256 _rate, uint256 _bonus) OneRateSale(_token, _rate, _bonus) TransferringSale(_basicToken) public {

    }
}
