pragma solidity ^0.5.0;


import "@daonomic/lib/contracts/roles/OwnableWhitelistAdminRole.sol";
import "./Whitelist.sol";


contract ReferrerProvider is Whitelist {
    event ReferrerProviderCreated(address account);
    event ReferrerChange(address indexed account, address referrer);

    constructor() public {
        emit ReferrerProviderCreated(address(this));
    }

    function getReferrer(address account) public view returns (address referrer);

    function isWhitelisted(address account) public view returns (bool) {
        return getReferrer(account) != address(0);
    }
}

contract ReferrerProviderImpl is Ownable, ReferrerProvider, OwnableWhitelistAdminRole {
    mapping(address => address) public referrers;

    function getReferrer(address _address) public view returns (address referrer) {
        referrer = referrers[_address];
    }

    function setReferrer(address _address, address _referrer) public onlyWhitelistAdmin {
        _setReferrer(_address, _referrer);
    }

    function _setReferrer(address _address, address _referrer) internal {
        referrers[_address] = _referrer;
        emit WhitelistChange(_address, _referrer != address(0));
        emit ReferrerChange(_address, _referrer);
    }
}
