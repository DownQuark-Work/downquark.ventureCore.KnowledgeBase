// @flow
import Web3 from 'web3';
import { promisify } from './utils/promisify';

export class DappWeb3Service {
  constructor() {
    this.web3 = new Web3(
      Web3.givenProvider || (window.web3 && window.web3.currentProvider),
    );
  }

  getNetworkId() {
    return this.web3.eth.net.getId();
  }

  getWalletAddress() {
    return this.web3.eth.getAccounts().then((accounts) => accounts[0]);
  }

  signMessage(message) {
    return this.getWalletAddress().then((walletAddress) =>
      this.web3.eth.personal.sign(message, walletAddress),
    );
  }

  estimateGas({ to, data }) {
    return this.web3.eth.estimateGas({
      to,
      data,
    });
  }

  sendTransaction(options) {
    const sendTransaction = promisify(
      this.web3.eth.sendTransaction.bind(this.web3.eth),
    );

    return this.getWalletAddress().then((walletAddress) =>
      sendTransaction({
        ...options,
        from: walletAddress,
      }),
    );
  }

  createContract(abi, address) {
    return new this.web3.eth.Contract(abi, address);
  }

  setDefaultAddress(address) {
    this.web3.eth.defaultAccount = address;
  }
}
