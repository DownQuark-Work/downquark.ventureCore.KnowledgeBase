pragma solidity ^0.5.0;

import "../../contracts/Conversions.sol";
import "../../contracts/PaymentMethods.sol";

contract TestConversions is Conversions, PaymentMethods {
    function _getConversionRate(address _source, address _destination, uint _value) view internal returns (uint rate) {
        if (_destination == USD) {
            if (_source == ETH) {
                return 120 * 10 ** 18;
            } else if (_source == BTC) {
                return 3500 * 10 ** 18;
            } else {
                revert();
            }
        } else if (_source == USD) {
            if (_destination == ETH) {
                return 8333333333333333;
            } else if (_destination == BTC) {
                return 285714285714285;
            } else {
                revert();
            }
        } else {
            revert();
        }
    }
}

