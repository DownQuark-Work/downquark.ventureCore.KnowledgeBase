import { WEBSOCKET_URL } from '../_utils/constants.ts'

export const isWebsocketRequest = (pName:string):boolean => /\/ws\/?$/i.test(pName)

const peers = new Map<number, WebSocket>();
let peerId = 0;
const dispatch = (msg: string): void => {
  for (const peer of peers.values()) {
    peer.send(msg);
  }
}
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
  ws.send(reply as string);
}
const handleError = (e: Event | ErrorEvent) => {
  console.log(e instanceof ErrorEvent ? e.message : e.type);
}

export const wsHandlerClient = {
  logError,
  handleConnected,
  handleMessage,
  handleError,
}
