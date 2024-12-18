pragma solidity ^0.5.0;

import "./AbstractSale.sol";
import "./kyberContracts/KyberNetworkProxyInterface.sol";

contract KyberNetworkWrapper {

  event SwapTokenChange(uint startTokenBalance, uint change);
  event ETHReceived(address indexed sender, uint amount);

  Token constant internal ETH_TOKEN_ADDRESS = Token(0x00eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee);

  function() payable external {
    emit ETHReceived(msg.sender, msg.value);
  }

  /// @dev Get the ETH price of the selling token (one full token, not cent)
  function getETHPrice(AbstractSale _sale) public view returns (uint ethPrice) {
    uint256 rate = _sale.getRate(address(0));
    ethPrice = 1 * 10 ** 36 / rate;
  }

  /// @dev Get the rate for user's token
  /// @param _kyberProxy KyberNetworkProxyInterface address
  /// @param token ERC20 token address
  /// @return expectedRate, slippageRate
  function getTokenRate(
    KyberNetworkProxyInterface _kyberProxy,
    AbstractSale _sale,
    Token token
  )
  public
  view
  returns (uint, uint)
  {
    uint256 ethPrice = getETHPrice(_sale);

    // Get the expected and slippage rates of the token to ETH
    (uint expectedRate, uint slippageRate) = _kyberProxy.getExpectedRate(token, ETH_TOKEN_ADDRESS, ethPrice);

    return (expectedRate, slippageRate);
  }

  /// @dev Acquires selling token using Kyber Network's supported token
  /// @param _kyberProxy KyberNetworkProxyInterface address
  /// @param _sale Sale address
  /// @param token ERC20 token address
  /// @param tokenQty Amount of tokens to be transferred by user
  /// @param maxDestQty Max amount of eth to contribute
  /// @param minRate The minimum rate or slippage rate.
  /// @param walletId Wallet ID where Kyber referral fees will be sent to
  /// @param buyer Wallet where ICO tokens will be deposited (real buyer of tokens, not payer)
  function tradeAndBuy(
    KyberNetworkProxyInterface _kyberProxy,
    AbstractSale _sale,
    Token token,
    uint tokenQty,
    uint maxDestQty,
    uint minRate,
    address walletId,
    address buyer
  )
  public
  {
    // Check if user is allowed to buy
    require(_sale.canBuy(buyer));

    // Check that the user has transferred the token to this contract
    require(token.transferFrom(msg.sender, address(this), tokenQty));

    // Get the starting token balance of the wrapper's wallet
    uint startTokenBalance = token.balanceOf(address(this));

    // Mitigate ERC20 Approve front-running attack, by initially setting
    // allowance to 0
    require(token.approve(address(_kyberProxy), 0));

    // Verify that the token balance has not decreased from front-running
    require(token.balanceOf(address(this)) == startTokenBalance);

    // Once verified, set the token allowance to tokenQty
    require(token.approve(address(_kyberProxy), tokenQty));

    // Swap user's token to ETH to send to Sale contract
    uint userETH = _kyberProxy.tradeWithHint(token, tokenQty, ETH_TOKEN_ADDRESS, address(this), maxDestQty, minRate, walletId, "");

    _sale.buyTokens.value(userETH)(buyer);

    // Return change to player if any
    calcChange(token, startTokenBalance);
  }

  /// @dev Calculates token change and returns to payer
  /// @param token ERC20 token address
  /// @param startTokenBalance Starting token balance of the payer's wallet
  function calcChange(Token token, uint startTokenBalance) private {
    // Calculate change of player
    uint change = token.balanceOf(address(this));

    // Send back change if change is > 0
    if (change > 0) {
      // Log the exchange event
      emit SwapTokenChange(startTokenBalance, change);

      // Transfer change back to player
      token.transfer(msg.sender, change);
    }
  }
}
