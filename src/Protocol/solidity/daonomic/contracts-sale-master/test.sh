#!/usr/bin/env bash
rm -Rf build
ganache-cli --defaultBalanceEther=5000000000000000000 2>&1 > ganache-output.log &
truffle test --network=development
kill %1