import { crypto, serve } from  '../deps.ts'
import { p2pHandler } from './p2p.ts'
import { createGenesisBlock } from '../_v0/utils.bloqchain.ts'
import { isWebsocketRequest, wsHandler } from './utils.websocket.ts'

const port = 8080;

const handler = (request: Request): Response => {
  const body = `Your user-agent is:\n\n${
  request.headers.get("user-agent") ?? "Unknown"}`
  return new Response(body, { status: 200 })
}

const server = Deno.listen({ port: 8080 });
console.log("server starting on :8080....");
console.log('{server}', {server})
createGenesisBlock() // may as well as soon as the server spins up

async function requestHandler(req: Deno.RequestEvent) {
  const pathname = new URL(req.request.url).pathname
  if (isWebsocketRequest(pathname)) { // must be a CURL (or otherwise headless) request
    const { socket, response } = Deno.upgradeWebSocket(req.request);
    // p2pHandler(socket); // <-- I do not think this line should be firing on the serer files - (move to `client`?)
    wsHandler(socket) // <-- looks much better as the server handler
    // TODO: move genesis block to above location// TODO: move genesis block to above location
    // TODO: move genesis block to above location // TODO: move genesis block to above location
    // TODO: move genesis block to above location
    req.respondWith(response);
  }
  else {
    req.respondWith( new Response('stdout', { status: 200, headers: { "content-type": "text/html", }, }), )
  }
}
for await (const conn of server) {
  (async () => {
    const httpConn = Deno.serveHttp(conn);
    for await (const requestEvent of httpConn) {
      requestHandler(requestEvent)
    }
  })();
}
