pragma solidity ^0.5.0;

import "@daonomic/util/contracts/SafeMath.sol";
import "@daonomic/interfaces/contracts/BasicToken.sol";

contract BasicTokenImpl is BasicToken {
    using SafeMath for uint256;

    uint total;
    mapping(address => uint256) balances;

    function totalSupply() public view returns (uint) {
        return total;
    }

    /**
    * @dev Gets the balance of the specified address.
    * @param _owner The address to query the the balance of.
    * @return An uint256 representing the amount owned by the passed address.
    */
    function balanceOf(address _owner) public view returns (uint256 balance) {
        return balances[_owner];
    }

    /**
    * @dev transfer token for a specified address
    * @param _to The address to transfer to.
    * @param _value The amount to be transferred.
    */
    function transfer(address _to, uint256 _value) public returns (bool) {
        require(_to != address(0));
        require(_value <= balances[msg.sender]);

        // SafeMath.sub will throw if there is not enough balance.
        balances[msg.sender] = balances[msg.sender].sub(_value);
        balances[_to] = balances[_to].add(_value);
        emitTransfer(msg.sender, _to, _value);
        return true;
    }

    function emitTransfer(address _from, address _to, uint256 _value) internal {
        emit Transfer(_from, _to, _value);
    }
}
