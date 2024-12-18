pragma solidity ^0.5.0;


import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./Sale.sol";
import "./Decimals.sol";
import "./Conversions.sol";


contract AutoRateCappedSale is Ownable, Events, Conversions, Sale {
    using Decimals for address;

    function _getTokenDecimals() internal pure returns (uint);

    function _getBasePrice() view internal returns (address token, uint price);

    function _getCapLeft() internal view returns (uint);

    function _getPurchasedAmount(address _beneficiary, address _token, uint _value) internal returns (uint amount, uint change) {
        (address baseToken, uint basePrice) = _getBasePrice();
        uint tokenMult = _token.mult();
        uint baseValue = _convert(_token, _value.mul(10 ** 18).div(tokenMult), baseToken);
        amount = baseValue.mul(10 ** _getTokenDecimals()).div(basePrice);
        change = 0;

        uint left = _getCapLeft();
        if (left < amount) {
            amount = left;
            change = _value - _convert(baseToken, left.mul(basePrice).div(10 ** _getTokenDecimals()), _token).mul(tokenMult).div(10 ** 18);
        }
    }

    function getRate(address _token) view public returns (uint) {
        (address baseToken, uint basePrice) = _getBasePrice();
        uint inBaseToken = _convert(_token, 10 ** 18, baseToken);
        return inBaseToken.mul(10 ** 18).div(basePrice);
    }
}
