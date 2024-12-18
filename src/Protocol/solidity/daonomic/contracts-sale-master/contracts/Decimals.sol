pragma solidity ^0.5.0;


library Decimals {
    function mult(address _token) internal view returns (uint) {
        return 10 ** decimals(_token);
    }

    function decimals(address _token) internal view returns (uint) {
        if (_token == address(0)) {
            return 18;
        } else if (_token == address(1)) {
            return 2;
        } else if (_token == address(2)) {
            return 8;
        } else if (_token == address(3)) {
            return 8;
        } else if (_token == address(4)) {
            return 8;
        } else {
            return 0;
        }
    }
}
