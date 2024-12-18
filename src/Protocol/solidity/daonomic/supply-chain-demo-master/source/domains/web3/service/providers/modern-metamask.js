// @flow
import { DappWeb3Service } from './dapp-browser';

export class ModernMetamaskWeb3Service extends DappWeb3Service {
  getWalletAddress() {
    return this.web3.currentProvider.enable().then((accounts) => accounts[0]);
  }
}
