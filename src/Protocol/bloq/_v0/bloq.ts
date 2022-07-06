import { digestData } from './utils.ts'

import type { calculateHashType, qonstructorType } from '../types.d.ts'

class Bloq {
  public index: number
  public data: string
  public hash: string
  public previousHash: string | null
  public timestamp: number

  constructor(qonstructor:qonstructorType) {
      this.index = qonstructor.index
      this.previousHash = qonstructor.previousHash
      this.timestamp = qonstructor.timestamp
      this.data = qonstructor.data
      this.hash = qonstructor.hash
  }
}

const calculateHash = async (cHash:calculateHashType): Promise<string> => {
  const {index, previousHash, timestamp, data} = cHash
  const d = index + (previousHash || '') + timestamp + data
  return digestData(d).then(digestHex => {
      console.log('digestHex', digestHex)
      return digestHex
    })
}

const genesisBlockData = { index: 0, previousHash: '', timestamp: new Date().getTime(), data: 'dq.bloq.genesis' }
const genesisBlockHash = await calculateHash(genesisBlockData)
const genesisBlock: Bloq = new Bloq({ ...genesisBlockData, hash: genesisBlockHash })
const bloqchain: Bloq[] = [genesisBlock]
console.log('bloqchain', bloqchain)

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
