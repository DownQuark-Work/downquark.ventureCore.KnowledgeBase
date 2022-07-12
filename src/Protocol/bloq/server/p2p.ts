// PEER TO PPER (websocket)
// // https://github.com/denoland/deno_std/blob/main/examples/chat/server.ts

import { addBlockToChain,
//   createGenesisBlock,
//   generateNextBlock,
  getBlockchain,
//   getGenesisBlock,
  getLatestBlock,
  replaceChain, } from '../_v0/utils.bloqchain.ts'
import { isValidBlockStructure } from '../_v0/utils.validity.ts'
import { write, broadcast } from './utils.websocket.ts'

import type { BloqType, MessageType } from '../types.d.ts'
// import { enumMessageType } from '../types.d.ts'
enum enumMessageType {
  QUERY_LATEST = 0,
  QUERY_ALL = 1,
  RESPONSE_BLOCKCHAIN = 2,
}

const peersObj = new Map<number, WebSocket>();
let peerId = 0;
export const peers = Object.assign(peersObj, {
  peerId
})
  const id = ++peers.peerId;

const JSONToObject = <T>(data: any): T => {
  try {
    return JSON.parse(data as unknown as string);
  } catch (e) {
    console.log(e);
    return null as unknown as T;
  }
}

export const p2pMessageHandler = (ws: WebSocket, _data:any) => {
  console.log('INIT MESSAGE HANDLER')
  write(ws, queryChainLengthMsg())
  ws.onmessage = (dataMsg) => {
    const { type, data } = dataMsg
    const message: MessageType = {data, type}
    if (message === null) {
      console.log('could not parse received JSON message: ' + data);
      return;
    }
    console.log('Received message ', message);
    const msgDataType = message.data?.replace(/:.*$/,'')
    console.log('msgDataType', msgDataType)
    const switchType = msgDataType || message.type
    switch (switchType) {
      case 0:
        case 'Connected':
        console.log('zero case');
      case enumMessageType.QUERY_LATEST:
        console.log('QUERY_LATEST', responseLatestMsg())
        write(ws, responseLatestMsg());
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

const queryAllMsg = (): MessageType => ({'type': enumMessageType.QUERY_ALL, 'data': null})
const queryChainLengthMsg = (): MessageType => ({'type': enumMessageType.QUERY_LATEST, 'data': null})

const responseChainMsg = (): MessageType => ({
  type: enumMessageType.RESPONSE_BLOCKCHAIN,
  data: JSON.stringify(getBlockchain()),
});

const responseLatestMsg = (): MessageType => ({
  type: enumMessageType.RESPONSE_BLOCKCHAIN,
  data: JSON.stringify([getLatestBlock()]),
});

const handleBlockchainResponse = (receivedBlocks: BloqType[]) => {
  console.log('handleBlockchainResponse', handleBlockchainResponse)
    if (receivedBlocks.length === 0) {
        console.log('received block chain size of 0')
        return
    }
    const latestBlockReceived: BloqType = receivedBlocks[receivedBlocks.length - 1]
    if (!isValidBlockStructure(latestBlockReceived)) {
        console.log('block structuture not valid')
        return
    }
    const latestBlockHeld: BloqType = getLatestBlock()
    if (latestBlockReceived.index > latestBlockHeld.index) {
        console.log('blockchain possibly behind. We got: '
            + latestBlockHeld.index + ' Peer got: ' + latestBlockReceived.index)
        if (latestBlockHeld.hash === latestBlockReceived.previousHash) {
            if (addBlockToChain(latestBlockReceived)) {
                broadcast(responseLatestMsg())
            }
        } else if (receivedBlocks.length === 1) {
            console.log('We have to query the chain from our peer')
            broadcast(queryAllMsg())
        } else {
            console.log('Received blockchain is longer than current blockchain')
            replaceChain(receivedBlocks)
        }
    } else {
        console.log('received blockchain is not longer than received blockchain. Do nothing')
    }
}

export const broadcastLatest = (): void => {    broadcast(responseLatestMsg()) }
