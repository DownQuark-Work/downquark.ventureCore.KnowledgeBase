pragma solidity ^0.5.0;


import "../../contracts/MintingSale.sol";
import "../../contracts/SidechainSale.sol";
import "../../contracts/AutoRateNotCappedSale.sol";


contract SimpleCustomRateSale is Ownable, AutoRateNotCappedSale, MintingSale, SidechainSale {

    constructor(ERC20Mintable token) MintingSale(token) public {
    }

    function _getBasePrice() view internal returns (address token, uint price) {
        return (USD, 10 ** 17);
    }

    function _getTokenDecimals() internal pure returns (uint) {
        return 18;
    }

    mapping(address => mapping(address => uint)) public customRates;

    function _getConversionRate(address _source, address _destination, uint _value) view internal returns (uint rate) {
        return customRates[_source][_destination];
    }

    function setConversionRate(address _source, address _destination, uint _rate) public onlyOwner {
        customRates[_source][_destination] = _rate;
    }
}
