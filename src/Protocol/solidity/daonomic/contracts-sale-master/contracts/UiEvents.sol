pragma solidity ^0.5.0;

contract UiEvents {

    /**
     * @dev Should be emitted if new payment method added
     */
    event RateAdd(address token);
    /**
     * @dev Should be emitted if payment method removed
     */
    event RateRemove(address token);
    /**
     * @dev Should be emitted if purchase is processed through external tx
     */
    event ExternalTx(bytes txId);
}
