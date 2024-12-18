## Tokens

Some token contracts

### Contents

- [TokenImpl](contracts/TokenImpl.sol) - ERC20 implementation
- [ReadOnlyTokenImpl](contracts/ReadOnlyTokenImpl.sol) - read-only version of ERC20 (so we can pause all operations)
- [NotifyingTokenImpl](contracts/NotifyingTokenImpl.sol) - ERC20 + transferAndCall functionality (notifies [TokenReceiver](contracts/standard/TokenReceiver.sol) about token transfers)

### Disclaimer

Standard contracts based on zeppelin-solidity tokens. Added some other tokens + added tests.