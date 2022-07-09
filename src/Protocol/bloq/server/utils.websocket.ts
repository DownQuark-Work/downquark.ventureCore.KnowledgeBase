import { WEBSOCKET_URL } from '../_utils/constants.ts'
import { p2pMessageHandler } from './p2p.ts'

// import { enumMessageType } from '../types.d.ts';
export type MessageClassType = InstanceType<typeof Message>

enum enumMessageType {
  QUERY_LATEST = 0,
  QUERY_ALL = 1,
  RESPONSE_BLOCKCHAIN = 2,
}

const peers = new Map<number, WebSocket>();
let peerId = 0;
const dispatch = (msg: string): void => {
  for (const peer of peers.values()) {
    peer.send(msg);
  }
}

class Message {
  public type: enumMessageType|string = 0;
  public data: any;
}
const write = (ws: WebSocket, message: Message): void => {ws.send(JSON.stringify(message));}
const broadcast = (message: Message): void => { for (const peer of peers.values()) { write(peer, message) }};
// const broadcast = (message: Message): void => sockets.forEach((socket) => write(socket, message));

export const wsHandlerServer = (ws: WebSocket) => {
  const id = ++peerId;
  peers.set(id, ws);
  ws.onopen = () => {
    dispatch(`Connected: [${id}]`);
  };
  ws.onmessage = (e) => {
    console.log(`msg:${id}`, e.data);
    dispatch(`[${id}]: ${e.data}`);
  };
  ws.onclose = () => {
    peers.delete(id);
    dispatch(`Closed: [${id}]`);
  };
}

// client(peer) websocket events
const logError = (msg: string) => {
  console.log(msg);
  Deno.exit(1);
}
const handleConnected = (ws: WebSocket) => {
  handleMessage(ws, `Client Websocket: ${WEBSOCKET_URL}`);
}
const handleMessage = (ws: WebSocket, data: string) => {
  console.log("SERVER >> " + data);
  const reply = prompt("Client >> ") || "No reply";
  if (reply === "exit") {
    return ws.close();
  }
  // TODO: Append P2P on message function here 
  ws.send(reply as string);
}
const handleError = (e: Event | ErrorEvent) => {
  console.log(e instanceof ErrorEvent ? e.message : e.type);
}

export const wsHandlerClient = {
  logError,
  handleConnected,
  handleMessage: p2pMessageHandler,
  handleError,
}
