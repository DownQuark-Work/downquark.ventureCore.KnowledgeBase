pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/SafeERC20.sol";
import "./Events.sol";

/**
 * @title Sale
 * @dev Sale is a base contract for managing a crowdsale,
 * allowing investors to purchase with ether or other payment methods (ERC-20 tokens or BTC etc.)
 * This contract implements such functionality in its most fundamental form and can be extended
 * to provide additional functionality and/or custom behavior.
 * The external interface represents the basic interface for purchasing items, and conform
 * the base architecture for crowdsales. They are *not* intended to be modified / overridden.
 * The internal interface conforms the extensible and modifiable surface of crowdsales. Override
 * the methods to add functionality. Consider using 'super' where appropriate to concatenate
 * behavior.
 * This contract is based on openzeppelin Crowdsale contract
 */
contract Sale is Ownable, Events {
    using SafeMath for uint256;

    struct ExtraBonus {
        address beneficiary;
        BonusItem[] items;
    }

    struct BonusItem {
        uint amount;
        BonusType bonusType;
    }

    function() external payable {
        _purchase(msg.sender, address(0), msg.value);
    }

    function buyTokens(address payable _beneficiary) external payable {
        _purchase(_beneficiary, address(0), msg.value);
    }

    /**
     * @dev low level purchase ***DO NOT OVERRIDE***
     * @param _beneficiary Recipient of the purchase
     * @param _token Token paid
     * @param _value value paid
     */
    function _purchase(address payable _beneficiary, address _token, uint _value) internal {
        _preValidatePurchase(_beneficiary, _token, _value);
        (uint purchased, uint change) = _getPurchasedAmount(_beneficiary, _token, _value);
        require(purchased > 0);
        (BonusItem[] memory bonuses, ExtraBonus[] memory extraBonuses) = _getBonuses(_beneficiary, purchased);
        uint bonus = _calculateAndEmitBonusEvents(_beneficiary, bonuses);
        _deliver(_beneficiary, purchased + bonus);
        emit Purchase(_beneficiary, _token, _value, purchased, bonus);
        uint extraBonus = _deliverExtraBonuses(extraBonuses);
        _updateState(_beneficiary, _token, _value, purchased, bonus, extraBonus);
        _postValidatePurchase(_beneficiary, _token, _value, purchased, bonus, extraBonus);
        if (change > 0) {
            _processChange(_beneficiary, _token, change);
        }
    }

    function _deliverExtraBonuses(ExtraBonus[] memory extraBonuses) internal returns (uint extraBonus) {
        for (uint i = 0; i < extraBonuses.length; i++) {
            ExtraBonus memory bonus = extraBonuses[i];
            uint amount = _calculateAndEmitBonusEvents(bonus.beneficiary, bonus.items);
            _deliver(bonus.beneficiary, amount);
            extraBonus += amount;
        }
    }

    function _calculateAndEmitBonusEvents(address _beneficiary, BonusItem[] memory items) internal returns (uint) {
        uint result = 0;
        for (uint i = 0; i < items.length; i++) {
            BonusItem memory item = items[i];
            emit Bonus(_beneficiary, item.amount, item.bonusType);
            result += item.amount;
        }
        return result;
    }

    function _processChange(address payable _beneficiary, address _token, uint _change) internal {
        if (_token == address(0)) {
            _beneficiary.transfer(_change);
        }
    }

    function _preValidatePurchase(address _beneficiary, address /*_token*/, uint _value) view internal {
        require(_beneficiary != address(0));
        require(_value != 0);
    }

    function _getPurchasedAmount(address _beneficiary, address _token, uint _value) internal returns (uint amount, uint change);

    function _getBonuses(address _beneficiary, uint _amount) internal view returns (BonusItem[] memory main, ExtraBonus[] memory extra) {
        return (new BonusItem[](0), new ExtraBonus[](0));
    }

    function _deliver(address _beneficiary, uint _amount) internal;

    function _updateState(address _beneficiary, address _token, uint _value, uint _purchased, uint _bonus, uint _extraBonus) internal {

    }

    function _postValidatePurchase(address _beneficiary, address _token, uint _value, uint _purchased, uint _bonus, uint _extraBonus) internal {

    }

    function withdrawEth(address payable _to, uint _value) public onlyOwner {
        _to.transfer(_value);
    }
}
