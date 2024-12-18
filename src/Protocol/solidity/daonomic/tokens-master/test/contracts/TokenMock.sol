pragma solidity ^0.5.0;


import "../../contracts/TokenImpl.sol";


contract TokenMock is TokenImpl {
    constructor(address initialAccount, uint256 initialBalance) public {
        balances[initialAccount] = initialBalance;
        total = initialBalance;
    }
}
