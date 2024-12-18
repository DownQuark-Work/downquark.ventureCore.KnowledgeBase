pragma solidity ^0.5.0;


import "@daonomic/util/contracts/OwnableImpl.sol";
import "@daonomic/tokens/contracts/MintableTokenImpl.sol";
import "@daonomic/util/contracts/SecuredImpl.sol";


contract MintableTokenMock is SecuredImpl, MintableTokenImpl, OwnableImpl {
}
