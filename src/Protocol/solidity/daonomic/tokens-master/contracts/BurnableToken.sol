pragma solidity ^0.5.0;

import "@daonomic/interfaces/contracts/Token.sol";

contract BurnableToken is Token {
	event Burn(address indexed burner, uint256 value);
	function burn(uint256 _value) public;
}
