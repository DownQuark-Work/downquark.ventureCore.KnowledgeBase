pragma solidity ^0.5.0;


import "@daonomic/interfaces/contracts/Token.sol";


/// @title Kyber Network interface
contract KyberNetworkProxyInterface {
  function maxGasPrice() public view returns(uint);
  function getUserCapInWei(address user) public view returns(uint);
  function getUserCapInTokenWei(address user, Token token) public view returns(uint);
  function enabled() public view returns(bool);
  function info(bytes32 id) public view returns(uint);

  function getExpectedRate(Token src, Token dest, uint srcQty) public view
  returns (uint expectedRate, uint slippageRate);

  function tradeWithHint(Token src, uint srcAmount, Token dest, address payable destAddress, uint maxDestAmount,
    uint minConversionRate, address walletId, bytes memory hint) public payable returns(uint);
}