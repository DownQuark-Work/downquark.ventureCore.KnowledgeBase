pragma solidity ^0.5.0;


import "./ReferrerProvider.sol";
import "./WhitelistSale.sol";
import "./ReferralBonusSale.sol";


contract InternalWhitelistReferralBonusSale is Ownable, Events, ReferrerProvider, ReferrerProviderImpl, WhitelistSale, ReferralBonusSale {

    constructor(uint _referrerBonus, uint _refereeBonus) ReferralBonusSale(_referrerBonus, _refereeBonus) public {

    }

    function _getReferrer(address account) internal view returns (address referrer) {
        referrer = getReferrer(account);
    }

    function _isWhitelisted(address account) internal view returns (bool) {
        return isWhitelisted(account);
    }

    function setReferrer(address _address, address _referrer) public onlyWhitelistAdmin {
        if (_referrer != address(0) && _referrer != address(1)) {
            require(getReferrer(_referrer) != address(0));
        }
        _setReferrer(_address, _referrer);
    }

    function getWhitelist() public view returns (address) {
        return address(this);
    }
}
