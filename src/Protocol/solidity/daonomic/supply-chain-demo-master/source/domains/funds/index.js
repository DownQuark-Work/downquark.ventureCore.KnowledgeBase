import { web3Service } from '../web3/service';
import contract from './contract.json';

export const fund1 = web3Service.createContract(
  contract.abi,
  '0x4d5bf78B3c999EB9Fc18078B144D9e8254E10328',
);

export const fund2 = web3Service.createContract(
  contract.abi,
  '0x2D2Ed41aDF56A037fd156b3B42E3c2fAfd3a3fe4',
);

export const fund3 = web3Service.createContract(
  contract.abi,
  '0x1cfD8DE87A56860F3178cDF591fC37bCe8Dab3E7',
);

export const funds = [fund1, fund2, fund3];
