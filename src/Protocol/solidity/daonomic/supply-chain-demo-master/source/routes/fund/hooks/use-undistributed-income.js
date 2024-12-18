import React from 'react';
import web3 from 'web3';
import { fund1 } from '../../../domains/funds';
import { asset1, asset2, asset3 } from '../../../domains/assets';

function loadAssetData(asset, address) {
  return Promise.all([
    asset.methods.balanceOf(address).call(),
    asset.methods.dividendsRightsOf(address).call(),
  ]).then(([balance, income]) => ({
    owned: web3.utils.fromWei(balance),
    income: web3.utils.fromWei(income),
  }));
}

export function useUndistributedIncome() {
  const [state, setState] = React.useState({ dataState: 'idle', data: [] });

  function loadUndistributedIncome() {
    setState({ dataState: 'loading' });

    Promise.all([
      loadAssetData(asset1, fund1._address),
      loadAssetData(asset2, fund1._address),
      loadAssetData(asset3, fund1._address),
    ])
      .then(([data1, data2, data3]) => {
        setState({
          dataState: 'loaded',
          data: [
            { key: '1', name: 'Avocado farm', ...data1 },
            { key: '2', name: 'Farm 2', ...data2 },
            { key: '3', name: 'Farm 3', ...data3 },
          ],
        });
      })
      .catch((error) => {
        console.error(error);
        setState({ dataState: 'failed' });
      });
  }

  return {
    undistributedIncomeState: state,
    loadUndistributedIncome,
  };
}
