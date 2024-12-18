import web3 from 'web3';
import { web3Service } from '../../domains/web3/service';
import { asset1 } from '../../domains/assets';
import { assetOwners } from '../../domains/asset-owners';

export function sell({ amount, fund }) {
  return web3Service.getWalletAddress().then((walletAddress) => {
    if (walletAddress.toLowerCase() !== assetOwners[0]) {
      alert('Please switch to asset 1 owner account in metamask');
      return;
    }

    return asset1.methods
      .transfer(fund._address, web3.utils.toWei(String(amount)))
      .send({ from: walletAddress });
  });
}
