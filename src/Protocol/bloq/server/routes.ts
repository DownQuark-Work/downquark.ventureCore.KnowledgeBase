import {
  addBlockToChain,
  createGenesisBlock,
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
    app.post('/addPeer', (req, res) => {
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

//

export const apiRoutes: { [k: string]: { [k: string]: () => any } } = {
  GET: {
    blocks: () => JSON.stringify(getBlockchain()),
    peers: () => getPeers(), // extend this to return usable object from map
  },
  /// curl -d "user=user1&pass=abcd" -X POST https://example.com/login
  /// curl -X POST http://localhost:8080/api/v0/addPeer
  POST: {
    addPeer: () => connectToPeers('newone')
  }
};
