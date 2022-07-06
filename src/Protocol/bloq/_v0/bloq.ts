import { digestData } from './utils.ts'

import type { calculateHashType, qonstructorType } from '../types.d.ts'

class Bloq {
  public index: number
  public data: string
  public hash: string
  public previousHash: string
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
  const d = index + previousHash + timestamp + data
  return digestData(d).then(digestHex => {
      console.log('digestHex', digestHex)
      return digestHex
    })
}

// calculateHash({index:13, previousHash:'bob', timestamp:new Date().getTime(), data:'monkey'})
