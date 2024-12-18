pragma solidity ^0.5.0;

import "./TokenImpl.sol";
import "./BurnableToken.sol";

contract BurnableTokenImpl is TokenImpl, BurnableToken {
	/**
	 * @dev Burns a specific amount of tokens.
	 * @param _value The amount of token to be burned.
	 */
	function burn(uint256 _value) public {
		require(_value <= balances[msg.sender]);
		// no need to require value <= totalSupply, since that would imply the
		// sender's balance is greater than the totalSupply, which *should* be an assertion failure

		address burner = msg.sender;
		balances[burner] = balances[burner].sub(_value);
		total = total.sub(_value);
		emit Burn(burner, _value);
	}
}
