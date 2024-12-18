pragma solidity ^0.5.0;


import "../../contracts/FixedPools.sol";


contract SimpleFixedPools is FixedPools {
    constructor(ERC20Mintable token, uint fixedStart) FixedPools(token) public {
        registerPool("Direct", 1000000 * 10 ** 8, 0, ReleaseType.Direct);
        registerPool("Fixed", 1000000 * 10 ** 8, fixedStart, ReleaseType.Fixed);
    }
}
