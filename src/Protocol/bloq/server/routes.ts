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
/*
const initHttpServer = ( myHttpPort: number ) => {
    const app = express();
    app.use(bodyParser.json());

    √ app.get('/blocks', (req, res) => {
        res.send(getBlockchain());
    });
    app.post('/mineBlock', (req, res) => {
        const newBlock: Block = generateNextBlock(req.body.data);
        res.send(newBlock);
    });
    √ app.get('/peers', (req, res) => {
        res.send(getSockets().map(( s: any ) => s._socket.remoteAddress + ':' + s._socket.remotePort));
    });
    √ app.post('/addPeer', (req, res) => {
        connectToPeers(req.body.peer);
        res.send();
    });

    app.listen(myHttpPort, () => {
        console.log('Listening http on port: ' + myHttpPort);
    });
};
*/
// export const bloqchain
// function logMapElements(value: any, key: any, map: any) {
//   console.log(`m[${key}] = ${value}`);
// }
// peers: () => JSON.stringify(getPeers().forEach(logMapElements)),

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