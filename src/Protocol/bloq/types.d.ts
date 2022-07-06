import type { BloqClassType } from './_v0/bloq.ts'
export type BloqType = BloqClassType;

export type qonstructorType = {
  index: number,
  hash: string,
  previousHash: string
  timestamp: number,
  data: string,
}

export type calculateHashType = Omit<qonstructorType, 'hash'>;