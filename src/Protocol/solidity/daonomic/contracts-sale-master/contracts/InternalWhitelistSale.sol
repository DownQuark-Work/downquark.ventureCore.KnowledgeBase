pragma solidity ^0.5.0;

import "./WhitelistImpl.sol";
import "./WhitelistSale.sol";

contract InternalWhitelistSale is Ownable, Events, Whitelist, WhitelistImpl, WhitelistSale {
    function getWhitelist() public view returns (address) {
        return address(this);
    }

    function _isWhitelisted(address account) internal view returns (bool) {
        return isWhitelisted(account);
    }
}
