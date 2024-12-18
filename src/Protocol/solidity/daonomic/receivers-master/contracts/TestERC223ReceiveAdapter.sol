pragma solidity ^0.4.21;


import './ERC223ReceiveAdapter.sol';
import './TestReceiveAdapter.sol';


contract TestERC223ReceiveAdapter is ERC223ReceiveAdapter, TestReceiveAdapter {
}