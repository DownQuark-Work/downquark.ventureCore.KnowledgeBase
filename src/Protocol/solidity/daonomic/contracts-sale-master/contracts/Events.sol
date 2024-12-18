pragma solidity ^0.5.0;

contract Events {
    enum BonusType {
        AMOUNT,
        TIME,
        REFERRER,
        REFEREE,
        RESERVED1,
        RESERVED2,
        RESERVED3,
        RESERVED4,
        RESERVED5,
        RESERVED6,
        OTHER
    }

    event Purchase(address indexed beneficiary, address token, uint256 paid, uint256 purchased, uint256 bonus);

    event Bonus(address indexed beneficiary, uint256 amount, BonusType bonusType);
}
