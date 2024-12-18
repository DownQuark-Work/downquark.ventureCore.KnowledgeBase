pragma solidity ^0.5.0;


import "./ReferrerProvider.sol";
import "./WhitelistSale.sol";
import "./ReferralBonusSale.sol";


contract ExternalWhitelistReferralBonusSale is Ownable, Events, WhitelistSale, ReferralBonusSale {

    ReferrerProvider public referrerProvider;

    constructor(ReferrerProvider _referrerProvider, uint _referrerBonus, uint _refereeBonus) ReferralBonusSale(_referrerBonus, _refereeBonus) public {
        referrerProvider = _referrerProvider;
    }

    function _getReferrer(address account) internal view returns (address referrer) {
        return referrerProvider.getReferrer(account);
    }

    function _isWhitelisted(address account) internal view returns (bool) {
        return referrerProvider.isWhitelisted(account);
    }

    function getWhitelist() public view returns (address) {
        return address(referrerProvider);
    }
}
