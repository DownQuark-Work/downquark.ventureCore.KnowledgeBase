import React from 'react';
import web3 from 'web3';
import { fund1 } from '../../../domains/funds';
import { investor1, investor2, investor3 } from '../../../domains/investors';

export function useTokensDistribution() {
  const [state, setState] = React.useState({ dataState: 'idle', data: [] });

  function loadTokensDistribution() {
    setState({ ...state, dataState: 'loading' });

    Promise.all([
      fund1.methods.balanceOf(investor1).call(),
      fund1.methods.balanceOf(investor2).call(),
      fund1.methods.balanceOf(investor3).call(),
    ])
      .then((data) => {
        setState({
          dataState: 'loaded',
          data: data.map((amount) => web3.utils.fromWei(amount)),
        });
      })
      .catch((error) => {
        console.error(error);
        setState({ ...state, dataState: 'failed' });
      });
  }

  return {
    tokensDistribution: state,
    loadTokensDistribution,
  };
}
