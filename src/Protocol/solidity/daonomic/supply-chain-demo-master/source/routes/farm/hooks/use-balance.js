import React from 'react';
import web3 from 'web3';
import { cryptoYen } from '../../../domains/crypto-yen';
import { asset1 } from '../../../domains/assets';
import { assetOwners } from '../../../domains/asset-owners';

export function useBalance() {
  const [state, setState] = React.useState({
    dataState: 'idle',
    contract: 0,
    wallet: 0,
  });

  function loadBalance() {
    setState({ ...state, dataState: 'loading' });

    Promise.all([
      cryptoYen.methods.balanceOf(asset1._address).call(),
      cryptoYen.methods.balanceOf(assetOwners[0]).call(),
    ])
      .then(([contract, wallet]) => {
        setState({
          dataState: 'loaded',
          contract: web3.utils.fromWei(contract),
          wallet: web3.utils.fromWei(wallet),
        });
      })
      .catch((error) => {
        console.error(error);
        setState({ ...state, dataState: 'failed' });
      });
  }

  return {
    balanceState: state,
    loadBalance,
  };
}
