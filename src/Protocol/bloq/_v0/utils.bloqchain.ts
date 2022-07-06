import { Bloq } from './bloq.ts'
import { broadcastLatest } from '../server/p2p.ts'
import { calculateHash} from './utils.hash.ts'
import { isValidNewBlock, isValidChain } from './utils.validity.ts'

import { BloqType } from "../types.d.ts"
import type { calculateHashType } from '../types.d.ts'

let bloqchain:Array<BloqType> = []
export const getBlockchain = (): BloqType[] => bloqchain
export const getGenesisBlock = (): BloqType => bloqchain[0]
export const getLatestBlock = (): BloqType => bloqchain[bloqchain.length - 1]

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
  // addBlock(newBlock) && broadcastLatest()
  // addBlock(newBlock)
  // broadcastLatest()
  return newBlock
}

export const addBlockToChain = (newBlock: BloqType) => {
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