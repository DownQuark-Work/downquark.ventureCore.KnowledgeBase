pragma solidity ^0.4.21;


import '../../contracts/ERC20ReceiveAdapter.sol';
import '../../contracts/TestReceiveAdapter.sol';


contract ERC20ReceiveAdapterMock is ERC20ReceiveAdapter, TestReceiveAdapter {
}