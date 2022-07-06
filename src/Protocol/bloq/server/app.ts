import { crypto, serve } from  '../deps.ts'
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

const reqHandler = async (req:  Deno.RequestEvent) => {
  const pathname = new URL(req.request.url).pathname;
  if (req.request.method === "GET" && pathname === "/ws") {
    const { socket, response } = Deno.upgradeWebSocket(req.request);
    wsHandler(socket);
    req.respondWith(response);
  }
  else {
    const body = `Your user-agent is:\n\n${
      req.request.headers.get("user-agent") ?? "Unknown"
    } :: ${isWebsocketRequest(new URLPattern(req.request.url))}`
    console.log('request.headers', req.request.headers)
  }
  // return new Response(body, { status: 200 });
}

console.log(`HTTP webserver running. Access it at: http://localhost:8080/`);
// await serve(handler, { port });
const server = Deno.listen({ port: 8080 });
console.log("chat server starting on :8080....");
console.log('server', server)
for await (const conn of server) {
  
  (async () => {
    const httpConn = Deno.serveHttp(conn);
    for await (const requestEvent of httpConn) {
      reqHandler(requestEvent);
    }
  })}