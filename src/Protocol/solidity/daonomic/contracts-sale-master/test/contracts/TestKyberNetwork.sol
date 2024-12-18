pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "../../contracts/kyberContracts/KyberNetworkProxyInterface.sol";

contract TestKyberNetwork is KyberNetworkProxyInterface {
  using SafeMath for uint;

  address constant private ETH = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;
  IERC20 private DAI;
  IERC20 private WBTC;

  constructor(address dai, address wbtc) public {
    DAI = IERC20(dai);
    WBTC = IERC20(wbtc);
  }

  function () payable external {

  }

  function getExpectedRate(IERC20 src, IERC20 dest, uint srcQty) public view returns (uint expectedRate, uint slippageRate) {
    if (address(src) == ETH) {
      if (address(dest) == ETH) {
        return (1000000000000000000, 970000000000000000);
      } else if (address(dest) == address(DAI)) {
        return (183941000000000000000, 178422770000000000000);
      } else if (address(dest) == address(WBTC)) {
        return (34305518178032397, 34005518178032397);
      }
    } else if (address(src) == address(DAI)) {
      if (address(dest) == ETH) {
        return (5425911188000000, 5263133852360000);
      } else if (address(dest) == address(DAI)) {
        return (1000000000000000000, 970000000000000000);
      } else if (address(dest) == address(WBTC)) {
        return (186123700000000, 180539989000000);
      }
    } else if (address(src) == address(WBTC)) {
      if (address(dest) == ETH) {
        return (28967463617400000000, 28098439708878000000);
      } else if (address(dest) == address(DAI)) {
        return (183941000000000000000, 178422770000000000000);
      } else if (address(dest) == address(WBTC)) {
        return (1000000000000000000, 970000000000000000);
      }
    }
    revert();
  }

  function tradeWithHint(IERC20 src, uint srcAmount, IERC20 dest, address payable destAddress, uint maxDestAmount, uint minConversionRate, address walletId, bytes memory hint) public payable returns(uint) {
    if (address(src) == ETH) {
      require(srcAmount == msg.value);
    } else {
      src.transferFrom(msg.sender, address(this), srcAmount);
    }

    (uint rate,) = getExpectedRate(src, dest, 0);
    uint result = srcAmount * rate / 10 ** 18;
    uint spent = result.mul(10 ** 18) / rate;
    uint change = srcAmount.sub(spent);

    if (address(dest) == ETH) {
      destAddress.transfer(result);
    } else {
      require(dest.transfer(destAddress, result));
    }

    if (change > 0) {
      if (address(src) == ETH) {
        msg.sender.transfer(change);
      } else {
        src.transfer(msg.sender, change);
      }
    }

    return result;
  }
}
