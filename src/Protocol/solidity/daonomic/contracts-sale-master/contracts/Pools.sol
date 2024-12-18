pragma solidity ^0.5.0;


import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./TokenHolder.sol";
import "./AbstractPools.sol";


contract Pools is Ownable, AbstractPools {
    using SafeMath for uint256;

    ERC20Mintable public token;
    mapping(string => PoolDescription) pools;

    constructor(ERC20Mintable _token) public {
        token = _token;
    }

    function registerPool(string memory _name, uint _maxAmount, uint _releaseTime, ReleaseType _releaseType) internal {
        require(_maxAmount > 0, "maxAmount should be greater than 0");
        if (_releaseType == ReleaseType.Direct) {
            require(_releaseTime == 0, "release time should be 0 for ReleaseType.Direct");
        }
        pools[_name] = PoolDescription(_maxAmount, 0, _releaseTime, _releaseType);
        emit PoolCreatedEvent(_name, _maxAmount, _releaseTime, _releaseType);
    }

    function createHolder(string memory _name, address _beneficiary, uint _amount) onlyOwner public {
        PoolDescription storage pool = pools[_name];
        require(pool.maxAmount != 0, "pool is not defined");
        require(_amount.add(pool.releasedAmount) <= pool.maxAmount, "pool is depleted");
        pool.releasedAmount = _amount.add(pool.releasedAmount);
        uint releaseTime;
        if (pool.releaseType == ReleaseType.Fixed) {
            releaseTime = pool.releaseTime;
        } else {
            releaseTime = now.add(pool.releaseTime);
        }
        if (now > releaseTime || pool.releaseType == ReleaseType.Direct) {
            require(token.mint(_beneficiary, _amount));
            emit DirectTransferEvent(_name, _beneficiary, _amount);
        } else {
            TokenHolder created = new TokenHolder(token, _beneficiary, releaseTime, _amount);
            require(token.mint(address(created), _amount));
            emit TokenHolderCreatedEvent(_name, address(created), _beneficiary, _amount);
        }
    }

    function getTokensLeft(string memory _name) view public returns (uint) {
        PoolDescription storage pool = pools[_name];
        require(pool.maxAmount != 0, "pool is not defined");
        return pool.maxAmount.sub(pool.releasedAmount);
    }
}
