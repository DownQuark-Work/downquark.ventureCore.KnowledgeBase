pragma solidity ^0.5.0;


import '@daonomic/tokens/contracts/TokenImpl.sol';


// mock class using StandardToken
contract ERC20Mock is TokenImpl {

  constructor(address initialAccount, uint256 initialBalance) public {
    balances[initialAccount] = initialBalance;
    total = initialBalance;
  }

}
