pragma solidity ^0.5.0;


import "@daonomic/util/contracts/OwnableImpl.sol";
import "../../contracts/TokenImpl.sol";
import "../../contracts/RestrictedToken.sol";


contract RestrictedTokenMock is OwnableImpl, RestrictedToken {
    constructor(address initialAccount, uint256 initialBalance, RestrictingService _restrictingService) RestrictedToken(_restrictingService) public {
        balances[initialAccount] = initialBalance;
        total = initialBalance;
    }
}
