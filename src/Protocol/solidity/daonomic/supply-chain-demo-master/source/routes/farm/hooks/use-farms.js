import React from 'react';
import web3 from 'web3';
import { asset1 } from '../../../domains/assets';
import { assetOwners } from '../../../domains/asset-owners';
import { fund1, fund2, fund3 } from '../../../domains/funds';

function loadAssetData(asset, walletAddress) {
  return Promise.all([
    asset.methods.balanceOf(walletAddress).call(),
    asset.methods.dividendsRightsOf(walletAddress).call(),
  ]).then(([balance, undistributedIncome]) => ({
    supply: web3.utils.fromWei(balance),
    undistributedIncome: web3.utils.fromWei(undistributedIncome),
  }));
}

export function useFarms() {
  const [state, setState] = React.useState({ dataState: 'idle', data: [] });

  function loadFarms() {
    setState({ dataState: 'loading', data: [] });

    Promise.all([
      loadAssetData(asset1, assetOwners[0]),
      loadAssetData(asset1, fund1._address),
      loadAssetData(asset1, fund2._address),
      loadAssetData(asset1, fund3._address),
    ])
      .then(([data1, data2, data3, data4]) => {
        setState({
          dataState: 'loaded',
          data: [
            { key: '1', name: 'Avocado farm (me)', ...data1 },
            { key: '2', name: 'Fund 1', ...data2 },
            { key: '3', name: 'Fund 2', ...data3 },
            { key: '4', name: 'Fund 3', ...data4 },
          ],
        });
      })
      .catch((error) => {
        console.error(error);
        setState({ dataState: 'failed', data: [] });
      });
  }

  return {
    farmsState: state,
    loadFarms,
  };
}
