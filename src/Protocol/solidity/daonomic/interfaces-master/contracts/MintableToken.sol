pragma solidity ^0.5.0;


import "./Token.sol";


contract MintableToken is Token {
    event Mint(address indexed to, uint256 amount);

    function mint(address _to, uint256 _amount) public returns (bool);
}
