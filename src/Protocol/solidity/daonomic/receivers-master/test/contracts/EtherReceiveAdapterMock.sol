pragma solidity ^0.4.21;


import '../../contracts/EtherReceiveAdapter.sol';
import '../../contracts/TestReceiveAdapter.sol';


contract EtherReceiveAdapterMock is EtherReceiveAdapter, TestReceiveAdapter {
}