import {
  addBlockToChain,
  generateNextBlock,
  getBlockchain,
  getGenesisBlock,
  getLatestBlock,
  replaceChain,
} from '../_v0/utils.bloqchain.ts';
import { connectToPeers, getPeers } from './utils.websocket.ts';
import { broadcastLatest } from './p2p.ts';

import type { BloqType } from '../types.d.ts'

export const apiRoutes: { [k: string]: { [k: string]: (req?:any) => any } } = {
  GET: {
    blocks: () => JSON.stringify(getBlockchain()),
    peers: () => {
      const peerObj: {[k: string]:WebSocket} = {}
      getPeers().forEach((value, key, map) => peerObj[key] = value)
      return JSON.stringify(peerObj)
    }, // extend this to return usable object from map
  },
  /// curl http://localhost:8080/api/v0/peers
  /// curl -X POST http://localhost:8080/api/v0/addPeer
  /// curl -d "user=user1&pass=abcd" -X POST http://localhost:8080/api/v0/mineBlock
    // -> btoa(JSON.stringify({ a:'b', b:1 })) ==> eyJhIjoiYiIsImIiOjF9
  // curl -X POST http://localhost:8080/api/v0/mineBlock/eyJhIjoiYiIsImIiOjF9
  POST: {
    addPeer: () => connectToPeers(),
    mineBlock: req => {
      const newBlock: any = generateNextBlock(req)
      addBlockToChain(newBlock)
      return JSON.stringify(getBlockchain())
    },
  }
};