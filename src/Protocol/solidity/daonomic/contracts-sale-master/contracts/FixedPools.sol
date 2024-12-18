pragma solidity ^0.5.0;


import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./TokenHolder.sol";
import "./AbstractPools.sol";


contract FixedPools is Ownable, AbstractPools {
    using SafeMath for uint256;

    event ReleasedEvent(address beneficiary, uint amount);

    ERC20Mintable public token;
    string[] poolNames;
    mapping(string => PoolDescription) pools;
    mapping(string => mapping(address => uint)) amounts;

    constructor(ERC20Mintable _token) public {
        token = _token;
    }

    function registerPool(string memory _name, uint _maxAmount, uint _releaseTime, ReleaseType _releaseType) internal {
        require(_maxAmount > 0, "maxAmount should be greater than 0");
        require(_releaseType != ReleaseType.Floating, "ReleaseType.Floating is not supported. use Pools instead of FixedPools");
        if (_releaseType == ReleaseType.Direct) {
            require(_releaseTime == 0, "release time should be 0 for ReleaseType.Direct");
        }
        if (_releaseTime == 0) {
            require(_releaseType == ReleaseType.Direct, "release time can be 0 only for ReleaseType.Direct");
        }
        pools[_name] = PoolDescription(_maxAmount, 0, _releaseTime, _releaseType);
        emit PoolCreatedEvent(_name, _maxAmount, _releaseTime, _releaseType);
        poolNames.push(_name);
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
        if (now >= releaseTime) {
            require(token.mint(_beneficiary, _amount));
            emit DirectTransferEvent(_name, _beneficiary, _amount);
        } else {
            require(token.mint(address(this), _amount));
            amounts[_name][_beneficiary] += _amount;
            emit TokenHolderCreatedEvent(_name, address(this), _beneficiary, _amount);
        }
    }

    function release() public {
        uint amount;
        for (uint i = 0; i < poolNames.length; i++) {
            string memory name = poolNames[i];
            PoolDescription memory pool = pools[name];
            if (pool.releaseType == ReleaseType.Fixed) {
                uint poolAmount = amounts[name][msg.sender];
                if (poolAmount > 0 && pool.releaseTime <= now) {
                    amount += poolAmount;
                }
            }
        }
        require(amount > 0);
        require(token.transfer(msg.sender, amount));
        emit ReleasedEvent(msg.sender, amount);
    }

    function getTokensLeft(string memory _name) view public returns (uint) {
        PoolDescription storage pool = pools[_name];
        require(pool.maxAmount != 0, "pool is not defined");
        return pool.maxAmount.sub(pool.releasedAmount);
    }
}
