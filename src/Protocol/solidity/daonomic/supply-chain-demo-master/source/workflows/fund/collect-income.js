import { web3Service } from '../../domains/web3/service';
import { fund1 } from '../../domains/funds';
import { assets } from '../../domains/assets';

export function collectIncome() {
  return web3Service.getWalletAddress().then((walletAddress) => {
    return Promise.all(
      assets.map((asset) => {
        return asset.methods
          .dividendsRightsOf(fund1._address)
          .call()
          .then((balance) => {
            return asset.methods
              .releaseDividendsRights(fund1._address, balance)
              .send({ from: walletAddress })
              .then(() => {
                return fund1.methods
                  .acceptDividends(asset._address, balance)
                  .send({ from: walletAddress });
              });
          });
      }),
    );
  });
}
