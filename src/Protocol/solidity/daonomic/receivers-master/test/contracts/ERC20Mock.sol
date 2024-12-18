pragma solidity ^0.4.21;


import "@daonomic/tokens/contracts/TokenImpl.sol";


contract ERC20Mock is TokenImpl {
    function ERC20Mock(address initialAccount, uint256 initialBalance) public {
        balances[initialAccount] = initialBalance;
        totalSupply = initialBalance;
    }
}
