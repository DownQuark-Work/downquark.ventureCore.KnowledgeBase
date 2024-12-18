pragma solidity ^0.5.0;

import "@daonomic/lib/contracts/roles/OperatorRole.sol";
import "./Sale.sol";
import "./UiEvents.sol";
import "./PaymentMethods.sol";

contract SidechainSale is Ownable, Events, UiEvents, PaymentMethods, OperatorRole, Sale {
    event XPubChange(address token, string xpub);
    event Change(address token, uint value);

    mapping(address => string) xpubs;

    function setXPub(address _token, string memory _xpub) onlyOwner public {
        setXPubInternal(_token, _xpub);
    }

    function setXPubInternal(address _token, string memory _xpub) internal {
        xpubs[_token] = _xpub;
        emit XPubChange(_token, _xpub);
    }

    function getXPub(address token) view public returns (string memory) {
        return xpubs[token];
    }

    function onReceive(address payable _buyer, address _token, uint256 _value, bytes memory _txId) onlyOperator public {
        require(_token != address(0));
        emit ExternalTx(_txId);
        _purchase(_buyer, _token, _value);
    }

    function _processChange(address payable _beneficiary, address _token, uint _change) internal {
        super._processChange(_beneficiary, _token, _change);
        if (_token == USD || _token == BTC || _token == LTC || _token == BCH) {
            emit Change(_token, _change);
        }
    }
}
