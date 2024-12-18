pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";
import "../../contracts/MintingSale.sol";
import "../../contracts/InternalWhitelistReferralBonusSale.sol";

contract SimpleReferralBonusSale is InternalWhitelistReferralBonusSale, MintingSale {

    constructor(ERC20Mintable _token, uint _referrerBonus, uint _refereeBonus) InternalWhitelistReferralBonusSale(_referrerBonus, _refereeBonus) MintingSale(_token) public {

    }

    function _getPurchasedAmount(address _beneficiary, address _token, uint _value) internal returns (uint amount, uint change) {
        require(_token == address(0), "only eth payments accepted");
        return (_value * 10, 0);
    }

    function _getReferrer(address account) internal view returns (address referrer) {
        referrer = getReferrer(account);
    }

    function _isWhitelisted(address account) internal view returns (bool) {
        return isWhitelisted(account);
    }
}
