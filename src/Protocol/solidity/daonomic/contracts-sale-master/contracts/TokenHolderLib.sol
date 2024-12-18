pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";

library TokenHolderLib {
    struct Holder {
        IERC20 token;
        address beneficiary;
        uint releaseTime;
        uint total;
    }

    function release(Holder storage self) public {
        require(msg.sender == self.beneficiary);
        require(block.timestamp >= self.releaseTime);
        uint amount = self.token.balanceOf(address(this));
        require(amount > 0);
        self.token.transfer(msg.sender, amount);
    }

    function getVestedAmount(Holder storage self) view public returns (uint) {
        if (block.timestamp >= self.releaseTime) {
            return self.total;
        } else {
            return 0;
        }
    }

    function getReleasedAmount(Holder storage self) view public returns (uint) {
        if (self.token.balanceOf(address(this)) == 0) {
            return self.total;
        } else {
            return 0;
        }
    }
}
