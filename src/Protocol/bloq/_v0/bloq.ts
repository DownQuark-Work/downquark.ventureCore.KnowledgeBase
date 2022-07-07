import type { qonstructorType } from '../types.d.ts'
export type BloqClassType = InstanceType<typeof Bloq>

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

export { Bloq }