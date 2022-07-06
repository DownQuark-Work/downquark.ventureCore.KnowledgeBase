import { Bloq } from "../types.d.ts";

import type { calculateHashType } from '../types.d.ts'

const calculateHash = async (cHash:calculateHashType): Promise<string> => {
    const {index, previousHash, timestamp, data} = cHash
    const d = index + (previousHash || '') + timestamp + data
    return digestData(d).then(digestHex => {
        console.log('digestHex', digestHex)
        return digestHex
      })
  }

const getLatestBlock = () => bloqchain[bloqchain.length - 1]
const generateNextBlock = async (blockData: string) => {
  const previousBlock: Bloq = getLatestBlock()
  const nextIndex: number = previousBlock.index + 1
  const nextTimestamp: number = new Date().getTime()
  const nextHash: string = await calculateHash({
    index: nextIndex, previousHash: previousBlock.hash,
      timestamp: nextTimestamp, data: blockData,
  })
  const newBlock: Bloq = new Bloq({
    index: nextIndex, hash: nextHash,
      previousHash: previousBlock.hash,
      timestamp: nextTimestamp, data: blockData
  })
  return newBlock
}