pragma solidity ^0.5.0;


import "./AbstractSale.sol";


contract OneRateSale is AbstractSale {
    address public token;
    uint256 public rate;
    uint256 public bonus;

    constructor(address _token, uint256 _rate, uint256 _bonus) public {
        token = _token;
        rate = _rate;
        bonus = _bonus;
        emit RateAdd(_token);
    }

    function getRate(address _token) view public returns (uint256) {
        if (_token == token) {
            return rate;
        } else {
            return 0;
        }
    }

    function getBonuses(uint256 sold) view internal returns (BonusItem[] memory) {
        BonusItem[] memory result = new BonusItem[](1);
        result[0] = BonusItem(sold.mul(bonus).div(100), BonusType.OTHER);
        return result;
    }
}
