import { Bloq } from './bloq.ts'
import { broadcastLatest } from '../server/p2p.ts'
import { calculateHash} from './utils.hash.ts'
import { isValidNewBlock, isValidChain } from './utils.validity.ts'

import { BloqType } from "../types.d.ts"

let bloqchain:Array<BloqType> = []
const getBlockchain = (): BloqType[] => bloqchain
const getGenesisBlock = (): BloqType => bloqchain[0]
const getLatestBlock = (): BloqType => bloqchain[bloqchain.length - 1]

const generateNextBlock = async (blockData: string) => {
  const previousBlock = getLatestBlock()
  const nextIndex: number = previousBlock.index + 1
  const nextTimestamp: number = new Date().getTime()
  const nextHash: string = await calculateHash({
    index: nextIndex, previousHash: previousBlock.hash,
      timestamp: nextTimestamp, data: blockData,
  })
  const newBlock: BloqType = new Bloq({
    index: nextIndex, hash: nextHash,
      previousHash: previousBlock.hash,
      timestamp: nextTimestamp, data: blockData
  })
  
  addBlockToChain(newBlock) && broadcastLatest()
  return newBlock
}

const addBlockToChain = (newBlock: BloqType) => {
  if (isValidNewBlock(newBlock, getLatestBlock())) {
      bloqchain.push(newBlock)
      return true
  }
  return false
}

const replaceChain = (newBlocks: BloqType[]) => {
  if (isValidChain(newBlocks) && newBlocks.length > getBlockchain().length) {
      console.log('Received blockchain is valid. Replacing current blockchain with received blockchain')
      bloqchain = newBlocks
      broadcastLatest()
  } else {
      console.log('Received blockchain invalid')
  }
}

const createGenesisBlock = async () => {
  const bc = getBlockchain ? getBlockchain() : []
  if (!bc.length) {
    const genesisBlockData = { index: 0, previousHash: '', timestamp: new Date().getTime(), data: 'dq.bloq.genesis' }
    const genesisBlockHash = await calculateHash(genesisBlockData)
    const genesisBlock: Bloq = new Bloq({ ...genesisBlockData, hash: genesisBlockHash })
    bc.push(genesisBlock)
    console.log('Genesis Bloq on Chain: ', bc);
    
  }
}
createGenesisBlock()

export {
  addBlockToChain,
  generateNextBlock,
  getBlockchain,
  getGenesisBlock,
  getLatestBlock,
  replaceChain,
}