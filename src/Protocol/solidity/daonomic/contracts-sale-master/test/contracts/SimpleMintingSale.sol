pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;


import "../../contracts/MintingSale.sol";
import "../../contracts/RatesChangingSale.sol";
import "../../contracts/ERC20Sale.sol";


contract SimpleMintingSale is MintingSale, RatesChangingSale, ERC20Sale {

    constructor(ERC20Mintable _token) MintingSale(_token) public {

    }
}
