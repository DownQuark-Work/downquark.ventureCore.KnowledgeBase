pragma solidity ^0.5.0;


import "@daonomic/interfaces/contracts/Whitelist.sol";


contract TestWhitelist is Whitelist {
    address public investor;

    constructor(address _investor) public {
        investor = _investor;
    }

    function isInWhitelist(address addr) view public returns (bool) {
        return addr == investor;
    }
}
