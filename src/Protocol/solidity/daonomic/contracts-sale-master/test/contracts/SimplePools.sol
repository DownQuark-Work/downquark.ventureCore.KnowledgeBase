pragma solidity ^0.5.0;


import "../../contracts/Pools.sol";


contract SimplePools is Pools {
    constructor(ERC20Mintable token, uint floatingStart, uint fixedStart) Pools(token) public {
        registerPool("Direct", 1000000 * 10 ** 8, 0, ReleaseType.Direct);
        registerPool("Floating", 1000000 * 10 ** 8, floatingStart, ReleaseType.Floating);
        registerPool("Fixed", 1000000 * 10 ** 8, fixedStart, ReleaseType.Fixed);
    }
}
