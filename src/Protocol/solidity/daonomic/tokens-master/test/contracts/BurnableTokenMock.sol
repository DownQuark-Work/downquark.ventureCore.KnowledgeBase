pragma solidity ^0.5.0;


import "../../contracts/BurnableTokenImpl.sol";


contract BurnableTokenMock is BurnableTokenImpl {
	constructor(address initialAccount, uint initialBalance) public {
		balances[initialAccount] = initialBalance;
		total = initialBalance;
	}
}
