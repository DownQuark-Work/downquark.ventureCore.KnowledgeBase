import { web3Service } from '../web3/service';
import contract from './contract.json';

export const cryptoYen = web3Service.createContract(
  contract.abi,
  '0xd407E0ed18fcE18394330e7d0e2bC657892c9E33',
);
