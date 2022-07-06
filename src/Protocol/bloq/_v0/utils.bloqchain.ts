import { Bloq } from './bloq.ts'
import { calculateHash} from './utils.ts'

import { BloqType } from "../types.d.ts";
import type { calculateHashType } from '../types.d.ts'

let blqChain:Array<BloqType>
export const bloqchain = (arr:Bloq):Array<BloqType> => {
  blqChain = [...blqChain, arr]
  return blqChain
}

const getLatestBlock = () => blqChain[blqChain.length - 1]
const generateNextBlock = async (blockData: string) => {
  const previousBlock: BloqType = getLatestBlock()
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
  return newBlock
}