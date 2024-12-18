pragma solidity ^0.4.21;

import './ReceiveAdapter.sol';
import '@daonomic/interfaces/contracts/EtherReceiver.sol';

contract EtherReceiveAdapter is EtherReceiver, ReceiveAdapter {
    function () payable public {
        receiveWithData("");
    }

    function receiveWithData(bytes _data) payable public {
        onReceive(address(0), msg.sender, msg.value, _data);
    }
}