pragma solidity ^0.5.0;

import "@daonomic/util/contracts/OwnableImpl.sol";
import "./LoggingSale.sol";
import "./RatesChangingSale.sol";


contract ChangingLoggingSale is RatesChangingSale, LoggingSale, OwnableImpl {
}
