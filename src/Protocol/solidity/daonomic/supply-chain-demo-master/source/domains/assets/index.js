import { web3Service } from '../web3/service';
import contract from './contract.json';

export const asset1 = web3Service.createContract(
  contract.abi,
  '0x7a6d914e93Bb282d6108Ce57f9129c71D1E8b0C8',
);

export const asset2 = web3Service.createContract(
  contract.abi,
  '0x757A59143c6639a8B001DA73E0f9B4B1e0C30Af1',
);

export const asset3 = web3Service.createContract(
  contract.abi,
  '0x6204DE89144f65F0FbB7d2299BE832AF59fF2a20',
);

export const assets = [asset1, asset2, asset3];
