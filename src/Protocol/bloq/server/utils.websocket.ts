const WEBSOCKET_PATH = '/ws/'
export const isWebsocketRequest = (pName:string):boolean => {
  return /\/ws\/?$/i.test(pName)
}

const peers = new Map<number, WebSocket>();
let peerId = 0;
const dispatch = (msg: string): void => {
  for (const peer of peers.values()) {
    peer.send(msg);
  }
}
export const wsHandler = (ws: WebSocket) => {
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

function logError(msg: string) {
  console.log(msg);
  Deno.exit(1);
}
function handleConnected(ws: WebSocket) {
  console.log("Connected to server ...");
  handleMessage(ws, "Welcome!");
}
function handleMessage(ws: WebSocket, data: string) {
  console.log("SERVER >> " + data);
  const reply = prompt("Client >> ") || "No reply";
  if (reply === "exit") {
    return ws.close();
  }
  ws.send(reply as string);
}
function handleError(e: Event | ErrorEvent) {
  console.log(e instanceof ErrorEvent ? e.message : e.type);
}
