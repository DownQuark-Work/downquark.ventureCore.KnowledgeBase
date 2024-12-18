pragma solidity >=0.4.21 <0.6.0;

import "../../contracts/SecuredImpl.sol";
import "../../contracts/OwnableImpl.sol";

contract SecuredMock is SecuredImpl, OwnableImpl {
	function action1() only("operator") public {

	}

	function action2() only("user") public {

	}

	function action3() ownerOr("user") public {

	}

	function action4() any("user", "operator") public {

	}
}
