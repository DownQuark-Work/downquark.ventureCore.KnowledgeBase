pragma solidity ^0.5.0;


import "../../contracts/NotifyingTokenImpl.sol";


contract ReceiveNotifyTokenMock is NotifyingTokenImpl {
    constructor(address initialAccount, uint256 initialBalance) public {
        balances[initialAccount] = initialBalance;
        total = initialBalance;
    }
}
