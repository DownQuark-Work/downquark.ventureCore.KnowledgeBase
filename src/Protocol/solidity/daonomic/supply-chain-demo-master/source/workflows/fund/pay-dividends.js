import { web3Service } from '../../domains/web3/service';
import { fund1 } from '../../domains/funds';
import { cryptoYen } from '../../domains/crypto-yen';
import { investor1 } from '../../domains/investors';

export function payDividends() {
  return web3Service.getWalletAddress().then((walletAddress) => {
    return fund1.methods
      .dividendsRightsOf(investor1)
      .call()
      .then((balance) => {
        return fund1.methods
          .releaseDividendsRights(investor1, balance)
          .send({ from: walletAddress })
          .then(() => {
            return cryptoYen.methods
              .transferFrom(fund1._address, investor1, balance)
              .send({ from: walletAddress });
          });
      });
  });
}
