pragma solidity ^0.5.0;


import "@daonomic/interfaces/contracts/MintableToken.sol";
import "./AbstractSale.sol";

/**
 * @title This sale mints token when user sends accepted payments
 */
contract MintingSale is AbstractSale {
    MintableToken public token;

    constructor(address _token) public {
        token = MintableToken(_token);
    }

    function doPurchase(address buyer, uint256 sold, uint256 bonus) internal {
        token.mint(buyer, sold.add(bonus));
    }
}
