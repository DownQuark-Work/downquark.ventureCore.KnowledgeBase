import { web3Service } from '../web3/service';
import contract from './contract.json';

export const assetMarket1 = web3Service.createContract(
  contract.abi,
  '0x7c4E0b3CF5788786fD0cD381F47857C60c632fD5',
);

export const assetMarket2 = web3Service.createContract(
  contract.abi,
  '0xD687c9fD3082521568B9F134eE29e9e239feD22c',
);

export const assetMarket3 = web3Service.createContract(
  contract.abi,
  '0xAB75796a791025F464A860C5c3ECCF2C73Fc0Db4',
);
