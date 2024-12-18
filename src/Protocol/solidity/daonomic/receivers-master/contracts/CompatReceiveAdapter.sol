pragma solidity ^0.4.21;

import './ERC20ReceiveAdapter.sol';
import './ERC223ReceiveAdapter.sol';
import './EtherReceiveAdapter.sol';

/**
 * @dev This ReceiveAdapter supports all possible tokens
 */
contract CompatReceiveAdapter is ERC20ReceiveAdapter, ERC223ReceiveAdapter, EtherReceiveAdapter {

}