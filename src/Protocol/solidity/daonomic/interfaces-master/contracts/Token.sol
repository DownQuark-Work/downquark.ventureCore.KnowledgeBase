pragma solidity ^0.5.0;


import "./BasicToken.sol";


/**
 * @title ERC20 interface
 * @dev see https://github.com/ethereum/EIPs/issues/20
 */
contract Token is BasicToken {
  function allowance(address tokenOwner, address spender) public view returns (uint remaining);
  function approve(address spender, uint tokens) public returns (bool success);
  function transferFrom(address from, address to, uint tokens) public returns (bool success);

  event Approval(address indexed owner, address indexed spender, uint256 value);
}
