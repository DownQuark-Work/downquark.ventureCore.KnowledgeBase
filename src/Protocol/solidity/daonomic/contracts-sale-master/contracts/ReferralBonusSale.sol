pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./ReferrerProvider.sol";
import "./Sale.sol";
import "./HasBonusSale.sol";

contract ReferralBonusSale is Ownable, Events, Sale, HasBonusSale {

    uint public referrerBonus;
    uint public refereeBonus;

    constructor(uint _referrerBonus, uint _refereeBonus) public {
        referrerBonus = _referrerBonus;
        refereeBonus = _refereeBonus;
    }

    function _getReferrer(address account) internal view returns (address referrer);

    function _getBonuses(address _beneficiary, uint _amount) internal view returns (BonusItem[] memory main, ExtraBonus[] memory extra) {
        (main, extra) = super._getBonuses(_beneficiary, _amount);
        address referrer = _getReferrer(_beneficiary);
        if (referrer != address(0) && referrer != address(1)) {
            uint realReferrerBonus = _amount.mul(referrerBonus).div(1000);
            uint realRefereeBonus = _amount.mul(refereeBonus).div(1000);
            return (_addOneBonus(main, realRefereeBonus, BonusType.REFEREE), _addOneExtraBonus(extra, referrer, _createOneBonus(realReferrerBonus, BonusType.REFERRER)));
        } else {
            return (main, extra);
        }
    }

    function setReferrerBonus(uint _referrerBonus) public onlyOwner {
        referrerBonus = _referrerBonus;
    }

    function setRefereeBonus(uint _refereeBonus) public onlyOwner {
        refereeBonus = _refereeBonus;
    }
}
