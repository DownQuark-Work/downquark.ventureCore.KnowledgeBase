pragma solidity ^0.5.0;

contract RestrictingService {
    /**
     * @dev this is called from RestrictedToken when transfer has to be made
     * @dev RestrictingService can change its state
     * @return true if transfer is allowed
     */
    function onTransfer(address _from, address _to, uint _amount) public returns (bool);
}
