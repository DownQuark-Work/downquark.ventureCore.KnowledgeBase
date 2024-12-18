pragma solidity ^0.5.0;


import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";


/// @title Kyber Network interface
contract KyberNetworkProxyInterface {
  function getExpectedRate(IERC20 src, IERC20 dest, uint srcQty) public view returns (uint expectedRate, uint slippageRate);

  function tradeWithHint(IERC20 src, uint srcAmount, IERC20 dest, address payable destAddress, uint maxDestAmount,
    uint minConversionRate, address walletId, bytes memory hint) public payable returns(uint);
}