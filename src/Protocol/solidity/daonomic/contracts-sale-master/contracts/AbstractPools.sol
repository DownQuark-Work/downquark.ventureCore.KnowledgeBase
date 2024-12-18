pragma solidity ^0.5.0;

contract AbstractPools {
    struct PoolDescription {
        /**
         * @dev maximal amount of tokens in this pool
         */
        uint maxAmount;
        /**
         * @dev amount of tokens already released
         */
        uint releasedAmount;
        /**
         * @dev release time
         */
        uint releaseTime;
        /**
         * @dev release type of the holder (fixed - date is set in seconds since 01.01.1970, floating - date is set in seconds since holder creation, direct - tokens are transferred to beneficiary immediately)
         */
        ReleaseType releaseType;
    }

    enum ReleaseType { Fixed, Floating, Direct }

    event PoolCreatedEvent(string name, uint maxAmount, uint releaseTime, ReleaseType releaseType);
    event TokenHolderCreatedEvent(string name, address holder, address beneficiary, uint amount);
    event DirectTransferEvent(string name, address beneficiary, uint amount);
}
