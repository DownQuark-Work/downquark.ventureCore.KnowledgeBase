import type { BloqClassType } from './_v0/bloq.ts'
import type { MessageClassType } from './server/utils.websocket.ts'

// export enum enumMessageType {
//   QUERY_LATEST = 0,
//   QUERY_ALL = 1,
//   RESPONSE_BLOCKCHAIN = 2,
// }

export type BloqType = BloqClassType;
export type MessageType = MessageClassType;

export type qonstructorType = {
  index: number,
  hash: string,
  previousHash: string
  timestamp: number,
  data: string,
}
export type calculateHashType = Omit<qonstructorType, 'hash'>;