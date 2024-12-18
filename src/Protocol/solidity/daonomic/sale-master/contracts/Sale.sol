pragma solidity ^0.5.0;


/**
 * @title Sale contract for Daonomic platform should implement this
 */
contract Sale {
    enum BonusType {
        AMOUNT,
        TIME,
        REFERRAL,
        RESERVED1,
        RESERVED2,
        RESERVED3,
        RESERVED4,
        RESERVED5,
        RESERVED6,
        OTHER
    }

    struct BonusItem {
        uint256 value;
        BonusType bonusType;
    }

    /**
     * @dev This event should be emitted when user buys something
     */
    event Purchase(address indexed buyer, address token, uint256 value, uint256 sold, uint256 bonus, bytes txId);
    /**
     * @dev This event should be emitted when user buys something
     */
    event Bonus(uint256 value, BonusType bonusType);
    /**
     * @dev Should be emitted if new payment method added
     */
    event RateAdd(address token);
    /**
     * @dev Should be emitted if payment method removed
     */
    event RateRemove(address token);

    /**
     * @dev Calculate rate for specified payment method
     */
    function getRate(address token) view public returns (uint256);
    /**
     * @dev Calculate current bonus in tokens
     */
    function getBonus(uint256 sold) view public returns (uint256);
    /**
     * @dev get xpub key for payment method (if applicable)
     */
    function getXPub(address token) view public returns (string memory);
}
