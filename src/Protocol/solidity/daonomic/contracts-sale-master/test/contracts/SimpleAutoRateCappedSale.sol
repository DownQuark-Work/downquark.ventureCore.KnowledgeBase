pragma solidity ^0.5.0;

import "../../contracts/MintingSale.sol";
import "../../contracts/SidechainSale.sol";
import "../../contracts/AutoRateCappedSale.sol";
import "./TestConversions.sol";

contract SimpleAutoRateCappedSale is Conversions, AutoRateCappedSale, MintingSale, SidechainSale, TestConversions {

    constructor(ERC20Mintable token) MintingSale(token) public {
    }

    function _getCapLeft() internal view returns (uint) {
        return 2000 * 10 ** 18;
    }

    function _getTokenDecimals() internal pure returns (uint) {
        return 18;
    }

    function _getBasePrice() view internal returns (address token, uint price) {
        return (USD, 10 ** 17);
    }

}
