pragma solidity ^0.5.0;

import "@daonomic/interfaces/contracts/BasicToken.sol";
import "./AbstractSale.sol";

/**
 * @title This sale transfers tokens from itself to buyer
 */
contract TransferringSale is AbstractSale {
    BasicToken public token;

    constructor(BasicToken _token) public {
        token = _token;
    }

    function doPurchase(address buyer, uint256 sold, uint256 bonus) internal {
        token.transfer(buyer, sold.add(bonus));
    }
}
