pragma solidity ^0.5.0;


import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";


/**
 * @title TokenHolder
 * @dev TokenHolder is a token holder contract that will allow a
 * beneficiary to extract the tokens after a given release time
 */
contract TokenHolder {
    event ReleasedEvent(address beneficiary, uint amount);

    IERC20 private token;
    address private beneficiary;
    uint public releaseTime;
    uint private total;

    constructor(IERC20 _token, address _beneficiary, uint256 _releaseTime, uint256 _amount) public {
        require(_amount > 0);
        token = _token;
        beneficiary = _beneficiary;
        releaseTime = _releaseTime;
        total = _amount;
    }

    /**
     * @notice Transfers tokens held by timelock to beneficiary.
     */
    function release() public {
        require(msg.sender == beneficiary);
        require(block.timestamp >= releaseTime);
        uint amount = token.balanceOf(address(this));
        require(amount > 0);
        token.transfer(msg.sender, amount);
        emit ReleasedEvent(msg.sender, amount);
    }

    function getTotalAmount() view public returns (uint) {
        return total;
    }

    function getVestedAmount() view public returns (uint) {
        if (block.timestamp >= releaseTime) {
            return total;
        } else {
            return 0;
        }
    }

    function getReleasedAmount() view public returns (uint) {
        if (token.balanceOf(address(this)) == 0) {
            return total;
        } else {
            return 0;
        }
    }
}
