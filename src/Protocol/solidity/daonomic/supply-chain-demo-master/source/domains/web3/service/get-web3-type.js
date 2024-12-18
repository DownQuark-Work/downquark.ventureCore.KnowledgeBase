// @flow
export function getWeb3Type() {
  if (window.ethereum) {
    return 'modernMetamask';
  }

  if (window.web3) {
    return 'dapp';
  }

  return null;
}
