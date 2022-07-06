const WEBSOCKET_PATH = '/ws/'
export const isWebsocketRequest = (urlPattern:URLPattern):boolean => {
  return /\/ws\/?$/i.test(urlPattern.pathname)
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

// const { socket, response } = Deno.upgradeWebSocket(req.request);
//     wsHandler(socket);
//     req.respondWith(response);

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
console.log("Connecting to server ...");
try {
  const ws = new WebSocket("ws://localhost:8000");
  ws.onopen = () => handleConnected(ws);
  ws.onmessage = (m) => handleMessage(ws, m.data);
  ws.onclose = () => logError("Disconnected from server ...");
  ws.onerror = (e) => handleError(e);
} catch (err) {
  logError("Failed to connect to server ... exiting");
}

/**
 * import { crypto, serve } from  '../deps.ts'
import { isWebsocketRequest, wsHandler } from './utils.websocket.ts'
import { initP2P } from './p2p.ts'

const port = 8080;

const handleWebsocketRequest = (req:any) => {
  console.log('req', req, req.headers)
  if (req.headers.get("upgrade") != "websocket") {
    return new Response(null, { status: 501 });
  }
  const { socket, response } = Deno.upgradeWebSocket(req);
  console.log('socket, response', socket, response)
  wsHandler(socket);
  return new Response('body', { status: 200 });
  // return req.respondWith(response);
}

const handler = (request: Request): Response => {
  console.log('request', request)
  const body = `Your user-agent is:\n\n${
    request.headers.get("user-agent") ?? "Unknown"
  } :: ${isWebsocketRequest(new URLPattern(request.url))}`
  console.log('request.headers', request.headers)
  return request.method === 'GET' && isWebsocketRequest(new URLPattern(request.url))
    ? handleWebsocketRequest(request)
    : new Response(body, { status: 200 });
};

console.log(`HTTP webserver running. Access it at: http://localhost:8080/`);
await serve(handler, { port });
 */