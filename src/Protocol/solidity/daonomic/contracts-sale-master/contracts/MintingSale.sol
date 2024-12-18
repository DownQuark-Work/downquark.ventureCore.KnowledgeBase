pragma solidity ^0.5.0;


import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";
import "./Sale.sol";


contract MintingSale is Ownable, Events, Sale {

    ERC20Mintable public token;

    constructor(ERC20Mintable _token) public {
        token = _token;
    }

    function _deliver(address _beneficiary, uint _amount) internal {
        require(token.mint(_beneficiary, _amount));
    }
}
