// https://github.com/denoland/deno_std/blob/main/examples/chat/server.ts

import { getLatestBlock } from '../_v0/utils.bloqchain.ts'
// import {addBlockToChain, Block, getBlockchain, getLatestBlock, isValidBlockStructure, replaceChain} from '../_v0/bloq.ts'

// import type { enumMessageType } from '../types.d.ts'
enum enumMessageType {
    QUERY_LATEST = 0,
    QUERY_ALL = 1,
    RESPONSE_BLOCKCHAIN = 2,
}

// const sockets: WebSocket[] = []
let sockets: WebSocket[] = []

class Message {
    public type: enumMessageType = 0;
    public data: any
}

// export const initP2P = (p2pPort: number) => {
    // const server: Server = new WebSocket.Server({port: p2pPort})
    // server.on('connection', (ws: WebSocket) => {
    //     initConnection(ws)
    // })
    // console.log('listening websocket p2p port on: ' + p2pPort)
// }
// Deno.upgradeWebSocket
const getSockets = () => sockets
const setSockets = (peers: WebSocket[]) => sockets = peers

export const initConnection = (ws: WebSocket) => {
    // sockets.push(ws)
    // initMessageHandler(ws)
    // initErrorHandler(ws)
    // write(ws, queryChainLengthMsg())
}

const JSONToObject = <T>(data: string): T => {
    try {
        return JSON.parse(data)
    } catch (e) {
        console.log(e)
        return null as unknown as T
    }
}

const write = (ws: WebSocket, message: Message): void => ws.send(JSON.stringify(message))
const broadcast = (message: Message): void => sockets.forEach((socket) => write(socket, message))

export const initMessageHandler = (ws:WebSocket, data:any) => {
    // ws.on('message', (data: string) => {
        const message: Message = JSONToObject<Message>(data)
        if (message === null) {
            console.log('could not parse received JSON message: ' + data)
            return
        }
        console.log('Received message' + JSON.stringify(message))
        switch (message.type) {
            case enumMessageType.QUERY_LATEST:
                write(ws, responseLatestMsg())
                break
            case enumMessageType.QUERY_ALL:
                write(ws, responseChainMsg())
                break
            case enumMessageType.RESPONSE_BLOCKCHAIN:
                const receivedBlocks: Block[] = JSONToObject<Block[]>(message.data)
                if (receivedBlocks === null) {
                    console.log('invalid blocks received:')
                    console.log(message.data)
                    break
                }
                handleBlockchainResponse(receivedBlocks)
                break
        }
    // })
}



// const queryChainLengthMsg = (): Message => ({'type': MessageType.QUERY_LATEST, 'data': null})

// const queryAllMsg = (): Message => ({'type': MessageType.QUERY_ALL, 'data': null})

// const responseChainMsg = (): Message => ({
//     'type': MessageType.RESPONSE_BLOCKCHAIN, 'data': JSON.stringify(getBlockchain())
// })

// const responseLatestMsg = (): Message => ({
//     'type': MessageType.RESPONSE_BLOCKCHAIN,
//     'data': JSON.stringify([getLatestBlock()])
// })

// const initErrorHandler = (ws: WebSocket) => {
//     const closeConnection = (myWs: WebSocket) => {
//         console.log('connection failed to peer: ' + myWs.url)
//         sockets.splice(sockets.indexOf(myWs), 1)
//     }
//     ws.on('close', () => closeConnection(ws))
//     ws.on('error', () => closeConnection(ws))
// }

// const handleBlockchainResponse = (receivedBlocks: Block[]) => {
//     if (receivedBlocks.length === 0) {
//         console.log('received block chain size of 0')
//         return
//     }
//     const latestBlockReceived: Block = receivedBlocks[receivedBlocks.length - 1]
//     if (!isValidBlockStructure(latestBlockReceived)) {
//         console.log('block structuture not valid')
//         return
//     }
//     const latestBlockHeld: Block = getLatestBlock()
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

export const broadcastLatest = (): void => {}
// {    broadcast(responseLatestMsg())
// }

// const connectToPeers = (newPeer: string): void => {
//     const ws: WebSocket = new WebSocket(newPeer)
//     ws.on('open', () => {
//         initConnection(ws)
//     })
//     ws.on('error', () => {
//         console.log('connection failed')
//     })
// }

// export {connectToPeers, broadcastLatest, initP2PServer, getSockets}