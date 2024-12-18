pragma solidity ^0.5.0;

import "../../contracts/MintingSale.sol";
import "../../contracts/SidechainSale.sol";
import "../../contracts/AutoRateNotCappedSale.sol";
import "./TestConversions.sol";

contract SimpleAutoRateSale is Conversions, TestConversions, AutoRateNotCappedSale, MintingSale, SidechainSale {

    constructor(ERC20Mintable token) MintingSale(token) public {
    }

    function _getTokenDecimals() internal pure returns (uint) {
        return 18;
    }

    function _getBasePrice() view internal returns (address token, uint price) {
        return (USD, 10 ** 17);
    }
}
