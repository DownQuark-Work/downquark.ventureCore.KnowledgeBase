import { PORT } from '../_utils/constants.ts'
import { crypto, serve } from  '../deps.ts'
// import { p2pHandler } from './p2p.ts'
import { createGenesisBlock } from '../_v0/utils.bloqchain.ts'
import { isWebsocketRequest, wsHandlerServer } from './utils.websocket.ts'

const server = Deno.listen({ port: PORT });
console.log(`server starting on :${PORT}....`);
console.log('{server}', {server})
createGenesisBlock() // may as well as soon as the server spins up

async function requestHandler(req: Deno.RequestEvent) {
  const pathname = new URL(req.request.url).pathname
  if (isWebsocketRequest(pathname)) { // must be a CURL (or otherwise headless) request
    const { socket, response } = Deno.upgradeWebSocket(req.request);
    // p2pHandler(socket); // <-- I do not think this line should be firing on the serer files - (move to `client`?)
    wsHandlerServer(socket)
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
