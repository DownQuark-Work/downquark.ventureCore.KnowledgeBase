// PEER TO PPER (websocket)
// // https://github.com/denoland/deno_std/blob/main/examples/chat/server.ts

import { getLatestBlock, getBlockchain } from '../_v0/utils.bloqchain.ts'
import { addBlockToChain, replaceChain } from '../_v0/utils.bloqchain.ts'
import { isValidBlockStructure } from '../_v0/utils.validity.ts'
// import {addBlockToChain, Block, getBlockchain, getLatestBlock, isValidBlockStructure, replaceChain} from '../_v0/bloq.ts'

import type { BloqType, MessageType } from '../types.d.ts'
// import { enumMessageType } from '../types.d.ts'
enum enumMessageType {
  QUERY_LATEST = 0,
  QUERY_ALL = 1,
  RESPONSE_BLOCKCHAIN = 2,
}

// let sockets: WebSocket[] = [];

///////////// THE BELOW METHODS SHOULD BE MOCED TO UTILS/WESOCKETS
// const getSockets = () => sockets;
// const setSockets = (peers: WebSocket[]) => (sockets = peers);

/* nix
// const peers = new Map<number, WebSocket>();
// let peerId = 0;
// const dispatch = (msg: string): void => {
//   for (const peer of peers.values()) {
//     peer.send(msg);
//   }
// };
*/

// export const initConnection = (ws: WebSocket) => {
//   initMessageHandler(ws);
//   initErrorHandler(ws)
//   write(ws, queryChainLengthMsg())
// };

const JSONToObject = <T>(data: any): T => {
  try {
    return JSON.parse(data as unknown as string);
  } catch (e) {
    console.log(e);
    return null as unknown as T;
  }
};

///////////// THE BELOW METHODS SHOULD BE MOCED TO UTILS/WESOCKETS
// const write = (ws: WebSocket, message: MessageType): void => {ws.send(JSON.stringify(message));}
// const broadcast = (message: MessageType): void => sockets.forEach((socket) => write(socket, message));

// const initMessageHandler = (ws: WebSocket) => {
export const p2pMessageHandler = (ws: WebSocket, _data:any) => {
  console.log('INIT MESSAGE HANDLER')
  ws.onmessage = (dataMsg) => {
    const { type, data } = dataMsg
    const message: MessageType = {data, type}
    if (message === null) {
      console.log('could not parse received JSON message: ' + data);
      return;
    }
    console.log('Received message ' + JSON.stringify(message));
    switch (message.type) {
      case enumMessageType.QUERY_LATEST:
        // write(ws, responseLatestMsg());
        break;
      case enumMessageType.QUERY_ALL:
        // write(ws, responseChainMsg());
        break;
      case enumMessageType.RESPONSE_BLOCKCHAIN:
        const receivedBlocks: BloqType[] = JSONToObject<BloqType[]>(
          message.data
        );
        if (receivedBlocks === null) {
          console.log('invalid blocks received:');
          console.log(message.data);
          break;
        }
        // handleBlockchainResponse(receivedBlocks)
        break;
      default:
        console.log('DEFAULT: MessageType - no action to take', message)
    }
  };
};

// const queryAllMsg = (): MessageType => ({'type': enumMessageType.QUERY_ALL, 'data': null})
// const queryChainLengthMsg = (): MessageType => ({'type': enumMessageType.QUERY_LATEST, 'data': null})

// const responseChainMsg = (): MessageType => ({
//   type: enumMessageType.RESPONSE_BLOCKCHAIN,
//   data: JSON.stringify(getBlockchain()),
// });

// const responseLatestMsg = (): MessageType => ({
//   type: enumMessageType.RESPONSE_BLOCKCHAIN,
//   data: JSON.stringify([getLatestBlock()]),
// });

// const initErrorHandler = (ws: WebSocket) => {
//   const closeConnection = (wskt: WebSocket) => {
//     console.log('connection failed to peer: ' + wskt.url)
//     sockets.splice(sockets.indexOf(wskt), 1)
//   }
//   ws.onclose = () => closeConnection(ws)
//   ws.onerror = () => closeConnection(ws)
// }

// const handleBlockchainResponse = (receivedBlocks: BloqType[]) => {
//   console.log('handleBlockchainResponse', handleBlockchainResponse)
//     if (receivedBlocks.length === 0) {
//         console.log('received block chain size of 0')
//         return
//     }
//     const latestBlockReceived: BloqType = receivedBlocks[receivedBlocks.length - 1]
//     if (!isValidBlockStructure(latestBlockReceived)) {
//         console.log('block structuture not valid')
//         return
//     }
//     const latestBlockHeld: BloqType = getLatestBlock()
//     if (latestBlockReceived.index > latestBlockHeld.index) {
//         console.log('blockchain possibly behind. We got: '
//             + latestBlockHeld.index + ' Peer got: ' + latestBlockReceived.index)
//         if (latestBlockHeld.hash === latestBlockReceived.previousHash) {
//             if (addBlockToChain(latestBlockReceived)) {
//                 broadcast(responseLatestMsg())
//             }
//         } else if (receivedBlocks.length === 1) {
//             console.log('We have to query the chain from our peer')
//             broadcast(queryAllMsg())
//         } else {
//             console.log('Received blockchain is longer than current blockchain')
//             replaceChain(receivedBlocks)
//         }
//     } else {
//         console.log('received blockchain is not longer than received blockchain. Do nothing')
//     }
// }

// export const broadcastLatest = (): void => {};
// // {    broadcast(responseLatestMsg())
// // }

/*
// export const p2pHandler = (ws: WebSocket) => {
//   const id = ++peerId
//   peers.set(id, ws)
//   ws.onopen = () => {
//     initConnection(ws)
//     dispatch(`Connected: [${id}]`)
//   }
// }
*/

// // export {connectToPeers, broadcastLatest, initP2PServer, getSockets}
