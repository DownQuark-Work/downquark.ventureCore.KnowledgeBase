pragma solidity ^0.5.0;


import "@daonomic/lib/contracts/roles/SignerRole.sol";
import "./Sale.sol";
import "./UiEvents.sol";


contract OneTimeAddressSale is Ownable, Events, UiEvents, SignerRole, Sale {

    function buyTokensSigned(address payable _buyer, bytes memory _txId, uint _value, uint8 _v, bytes32 _r, bytes32 _s) payable public {
        bytes32 hash = keccak256(abi.encodePacked(_value, msg.sender));
        require(isSigner(ecrecover(hash, _v, _r, _s)), "account is not signer");
        emit ExternalTx(_txId);
        _purchase(_buyer, address(0), _value);
    }
}
