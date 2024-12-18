pragma solidity ^0.5.0;


import "@daonomic/util/contracts/OwnableImpl.sol";
import "@daonomic/util/contracts/SecuredImpl.sol";
import "../../contracts/MintableTokenImpl.sol";


contract MintableTokenMock is MintableTokenImpl, OwnableImpl, SecuredImpl {
}
