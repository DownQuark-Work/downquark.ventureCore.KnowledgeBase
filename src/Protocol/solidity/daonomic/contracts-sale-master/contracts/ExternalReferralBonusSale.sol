pragma solidity ^0.5.0;

import "./Sale.sol";
import "./ReferralBonusSale.sol";

contract ExternalReferralBonusSale is Ownable, Events, ReferralBonusSale {

    ReferrerProvider public referrerProvider;

    constructor(ReferrerProvider _referrerProvider) public {
        referrerProvider = _referrerProvider;
    }

    function _getReferrer(address account) internal view returns (address) {
        return referrerProvider.getReferrer(account);
    }

    function getWhitelist() public view returns (address) {
        return address(referrerProvider);
    }
}
