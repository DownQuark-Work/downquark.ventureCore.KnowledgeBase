pragma solidity ^0.5.0;


import '@daonomic/util/contracts/SafeMath.sol';
import '@daonomic/util/contracts/Ownable.sol';
import "@daonomic/util/contracts/Secured.sol";
import './Sale.sol';


contract AbstractSale is Ownable, Sale, Secured {
    using SafeMath for uint256;

    event Withdraw(address to, uint256 value);

    function () payable external {
        onReceivePrivate(msg.sender, address(0), msg.value, "");
    }

    function buyTokens(address _buyer) payable public {
        onReceivePrivate(_buyer, address(0), msg.value, "");
    }

    function buyTokensSigned(address _buyer, bytes memory _txId, uint _value, uint8 _v, bytes32 _r, bytes32 _s) payable public {
        bytes32 hash = keccak256(abi.encodePacked(_value, msg.sender));
        require(ecrecover(hash, _v, _r, _s) == getRole("signer"));
        onReceivePrivate(_buyer, address(0), _value, _txId);
    }

    function onReceive(address _buyer, address _token, uint256 _value, bytes memory _txId) only("operator") public {
        require(_token != address(0));
        onReceivePrivate(_buyer, _token, _value, _txId);
    }

    function onReceivePrivate(address _buyer, address _token, uint256 _value, bytes memory _txId) private {
        uint256 sold = getSold(_token, _value);
        require(sold > 0);
        BonusItem[] memory bonuses = getBonuses(sold);
        uint256 bonus;
        for (uint256 i = 0; i < bonuses.length; i++) {
            bonus += bonuses[i].value;
            emit Bonus(bonuses[i].value, bonuses[i].bonusType);
        }
        checkPurchaseValid(_buyer, sold, bonus);
        doPurchase(_buyer, sold, bonus);
        emit Purchase(_buyer, _token, _value, sold, bonus, _txId);
        onPurchase(_buyer, _token, _value, sold, bonus);
    }

    function getSold(address _token, uint256 _value) view public returns (uint256) {
        uint256 rate = getRate(_token);
        require(rate > 0);
        return _value.mul(rate).div(10**18);
    }

    function getBonuses(uint256 sold) view internal returns (BonusItem[] memory bonuses);

    function getBonus(uint256 sold) view public returns (uint256 bonus) {
        BonusItem[] memory bonuses = getBonuses(sold);
        uint256 result;
        for (uint256 i = 0; i < bonuses.length; i++) {
            result += bonuses[i].value;
        }
        return result;
    }

    function getRate(address _token) view public returns (uint256);

    function doPurchase(address buyer, uint256 sold, uint256 bonus) internal;

    function checkPurchaseValid(address /*buyer*/, uint256 /*sold*/, uint256 /*bonus*/) internal {

    }

    function onPurchase(address /*buyer*/, address /*token*/, uint256 /*value*/, uint256 /*sold*/, uint256 /*bonus*/) internal {

    }

    function canBuy(address _address) view public returns (bool) {
        return true;
    }

    function withdrawEth(address payable _to, uint256 _value) onlyOwner public {
        _to.transfer(_value);
        emit Withdraw(_to, _value);
    }

    function getXPub(address token) view public returns (string memory) {
        return "";
    }
}
