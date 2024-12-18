import { expectedEthereumNetwork } from '../ethereum-network';
import { web3Service } from './service';

function isExpectedNetwork(networkId) {
  return String(networkId) === String(expectedEthereumNetwork.id);
}

export function checkWeb3() {
  if (!web3Service) {
    return Promise.resolve({
      success: false,
      errorCode: 'missingWeb3',
    });
  }

  let errorCode;

  return web3Service
    .getNetworkId()
    .then((currentNetworkId) => {
      if (!isExpectedNetwork(currentNetworkId)) {
        errorCode = 'invalidNetwork';
      }
    })
    .catch((error) => {
      console.error(error); // eslint-disable-line no-console
      errorCode = 'missingWeb3';
    })
    .then(() => {
      if (!errorCode) {
        return { success: true };
      }

      return {
        success: false,
        errorCode,
      };
    });
}
