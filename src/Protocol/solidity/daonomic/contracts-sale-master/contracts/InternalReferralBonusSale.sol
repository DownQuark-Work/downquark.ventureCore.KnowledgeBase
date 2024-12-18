pragma solidity ^0.5.0;

import "./ReferrerProvider.sol";
import "./ReferralBonusSale.sol";

contract InternalReferralBonusSale is Ownable, Events, ReferrerProvider, ReferrerProviderImpl, ReferralBonusSale {

    constructor(uint _referrerBonus, uint _refereeBonus) ReferralBonusSale(_referrerBonus, _refereeBonus) public {

    }

    function _getReferrer(address account) internal view returns (address referrer) {
        return getReferrer(account);
    }

    function getWhitelist() public view returns (address) {
        return address(this);
    }
}
