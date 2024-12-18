pragma solidity ^0.5.0;

contract Whitelist {
    event WhitelistCreated(address account);
    event WhitelistChange(address indexed account, bool allowed);

    constructor() public {
        emit WhitelistCreated(address(this));
    }

    function isWhitelisted(address account) public view returns (bool);
}
