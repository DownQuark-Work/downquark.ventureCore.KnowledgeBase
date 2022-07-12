import {
  addBlockToChain,
  createGenesisBlock,
  generateNextBlock,
  getBlockchain,
  getGenesisBlock,
  getLatestBlock,
  replaceChain,
} from '../_v0/utils.bloqchain.ts';
import { getPeers } from './utils.websocket.ts';
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
export const apiRoutes: { [k: string]: { [k: string]: () => string } } = {
  GET: {
    blocks: () => JSON.stringify(getBlockchain()),
    peers: () => JSON.stringify(getPeers()),
  },
};
