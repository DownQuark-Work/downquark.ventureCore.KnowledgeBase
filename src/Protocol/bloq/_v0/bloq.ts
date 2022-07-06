import { calculateHash } from './utils.ts'

import type { qonstructorType } from '../types.d.ts'
export type BloqClassType = InstanceType<typeof Bloq>

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

// init
const genesisBlockData = { index: 0, previousHash: '', timestamp: new Date().getTime(), data: 'dq.bloq.genesis' }
const genesisBlockHash = await calculateHash(genesisBlockData)
const genesisBlock: Bloq = new Bloq({ ...genesisBlockData, hash: genesisBlockHash })

const bloqchain: Bloq[] = [genesisBlock]
console.log('bloqchain', bloqchain)

export { Bloq }