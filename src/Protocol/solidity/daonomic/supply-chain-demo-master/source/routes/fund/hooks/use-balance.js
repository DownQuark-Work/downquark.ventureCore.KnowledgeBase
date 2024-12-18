import React from 'react';
import web3 from 'web3';
import { cryptoYen } from '../../../domains/crypto-yen';
import { fund1 } from '../../../domains/funds';

export function useBalance() {
  const [state, setState] = React.useState({
    dataState: 'idle',
    contract: 0,
  });

  function loadBalance() {
    setState({ ...state, dataState: 'loading' });

    cryptoYen.methods
      .balanceOf(fund1._address)
      .call()
      .then((contract) => {
        setState({
          dataState: 'loaded',
          contract: web3.utils.fromWei(contract),
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
