pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract Conversions {
    using SafeMath for uint;

    function _getConversionRate(address _source, address _destination, uint _value) view internal returns (uint rate);

    function _convert(address _source, uint _sourceValue, address _destination) view internal returns (uint) {
        if (_source == _destination) {
            return _sourceValue;
        }

        return _sourceValue.mul(_getConversionRate(_source, _destination, _sourceValue)).div(10 ** 18);
    }
}
