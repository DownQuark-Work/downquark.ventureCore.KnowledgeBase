pragma solidity ^0.5.0;

import "./kyberContracts/KyberNetworkProxyInterface.sol";
import "./ERC20Sale.sol";

contract KyberNetworkWrapper {

  IERC20 constant internal ETH_TOKEN = IERC20(0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE);

  event SwapTokenChange(uint change);
  event ETHReceived(address indexed sender, uint amount);

  function() payable external {
    emit ETHReceived(msg.sender, msg.value);
  }

  /// @dev Acquires selling token using Kyber Network's supported token
  /// @param _kyberProxy KyberNetworkProxyInterface address
  /// @param _sale Sale address
  /// @param srcToken ERC20 token address (investor has this token)
  /// @param destToken ERC20 token address (sale accepts this token)
  /// @param srcAmount Amount of tokens to be transferred by user
  /// @param maxDestQty Max amount of eth to contribute
  /// @param minRate The minimum rate or slippage rate.
  /// @param buyer Wallet where ICO tokens will be deposited (real buyer of tokens, not payer)
  function tradeAndBuy(
    KyberNetworkProxyInterface _kyberProxy,
    ERC20Sale _sale,
    IERC20 srcToken,
    uint srcAmount,
    IERC20 destToken,
    uint maxDestQty,
    uint minRate,
    address payable buyer
  )
  public payable
  {
    IERC20 kyberSrcToken = srcToken;
    IERC20 kyberDestToken = destToken;
    if (address(srcToken) == address(0)) {
      kyberSrcToken = ETH_TOKEN;
    }
    if (address(destToken) == address(0)) {
      kyberDestToken = ETH_TOKEN;
    }

    // Check that the user has transferred money to this contract
    uint got;
    if (address(kyberSrcToken) == address(ETH_TOKEN)) {
      require(srcAmount == msg.value);
      got = _kyberProxy.tradeWithHint.value(srcAmount)(ETH_TOKEN, srcAmount, kyberDestToken, address(this), maxDestQty, minRate, address(0), "");
    } else {
      require(kyberSrcToken.transferFrom(msg.sender, address(this), srcAmount));
      require(kyberSrcToken.approve(address(_kyberProxy), srcAmount));
      got = _kyberProxy.tradeWithHint(kyberSrcToken, srcAmount, kyberDestToken, address(this), maxDestQty, minRate, address(0), "");
    }

    //buy tokens
    if (address(kyberDestToken) == address(ETH_TOKEN)) {
      _sale.buyTokens.value(got)(buyer);
    } else {
      require(kyberDestToken.approve(address(_sale), got));
      _sale.receiveERC20(buyer, kyberDestToken, got);
    }

    //handle change
    if (address(kyberSrcToken) == address(ETH_TOKEN)) {
      uint change = address(this).balance;
      if (change > 0) {
        msg.sender.transfer(change);
        emit SwapTokenChange(change);
      }
    } else {
      uint change = kyberSrcToken.balanceOf(address(this));
      if (change > 0) {
        require(kyberSrcToken.transfer(msg.sender, change));
        emit SwapTokenChange(change);
      }
    }
  }
}
