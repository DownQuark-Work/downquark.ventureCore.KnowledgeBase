pragma solidity ^0.5.0;

import "../../contracts/kyberContracts/KyberNetworkProxyInterface.sol";

contract TestKyberNetwork is KyberNetworkProxyInterface{
  function () payable external {

  }

  function maxGasPrice() public view returns(uint) {
    return 0;
  }

  function getUserCapInWei(address user) public view returns(uint) {
    return 0;
  }

  function getUserCapInTokenWei(address user, Token token) public view returns(uint) {
    return 0;
  }

  function enabled() public view returns(bool) {
    return true;
  }

  function info(bytes32 id) public view returns(uint) {
    return 0;
  }

  function getExpectedRate(Token src, Token dest, uint srcQty) public view returns (uint expectedRate, uint slippageRate) {
    return (0, 0);
  }

  function tradeWithHint(Token src, uint srcAmount, Token dest, address payable destAddress, uint maxDestAmount, uint minConversionRate, address walletId, bytes memory hint) public payable returns(uint) {
    src.transferFrom(msg.sender, address(this), 300);
    destAddress.transfer(1000);
    return 1000;
  }
}
