pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;


import "./Sale.sol";
import "./UiEvents.sol";


contract RatesChangingSale is Ownable, Events, UiEvents, Sale {
    mapping(address => uint) public rates;

    struct Rate {
        address token;
        uint256 rate;
    }

    function _getPurchasedAmount(address _beneficiary, address _token, uint _value) internal returns (uint amount, uint change) {
        uint rate = rates[_token];
        require(rate != 0, "Rate is not set");
        return (_value.mul(rate), 0);
    }

    function getRate(address _token) view public returns (uint) {
        return rates[_token];
    }

    function setRate(address _token, uint _rate) public onlyOwner {
        if (_rate == 0) {
            emit RateRemove(_token);
        } else {
            emit RateAdd(_token);
        }
        rates[_token] = _rate;
    }

    function setRates(Rate[] memory _rates) onlyOwner public {
        for (uint i = 0; i < _rates.length; i++) {
            setRate(_rates[i].token, _rates[i].rate);
        }
    }
}
