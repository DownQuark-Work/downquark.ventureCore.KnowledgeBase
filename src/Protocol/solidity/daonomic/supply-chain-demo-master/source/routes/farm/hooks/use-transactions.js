import React from 'react';
import web3 from 'web3';
import { asset1 } from '../../../domains/assets';
import { assetOwners } from '../../../domains/asset-owners';

export function useTransactions() {
  const [state, setState] = React.useState({ dataState: 'idle', data: [] });

  function loadTransactions() {
    setState({ dataState: 'loading', data: [] });

    asset1
      .getPastEvents('Transfer', {
        fromBlock: 0,
        toBlock: 'latest',
        filter: {
          from: assetOwners[0],
        },
      })
      .then((events) => {
        const data = events
          .map((event) => ({
            type: 'Units sell',
            amount: web3.utils.fromWei(event.returnValues[2]),
            transactionHash: event.transactionHash,
          }))
          .reverse();

        setState({
          dataState: 'loaded',
          data,
        });
      })
      .catch((error) => {
        console.error(error);
        setState({ dataState: 'failed' });
      });
  }

  return {
    transactionsState: state,
    loadTransactions,
  };
}
