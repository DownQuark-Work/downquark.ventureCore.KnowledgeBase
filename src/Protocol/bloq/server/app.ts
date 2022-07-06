import { crypto, serve } from  '../deps.ts'
import { isWebsocketRequest, wsHandler } from './utils.websocket.ts'
import { reqHandlerWebSocket } from './app.websocket.ts'
import { initP2P } from './p2p.ts'

const port = 8080;

const handler = (request: Request): Response => {
  const body = `Your user-agent is:\n\n${
  request.headers.get("user-agent") ?? "Unknown"}`
  return new Response(body, { status: 200 })
}

const server = Deno.listen({ port: 8080 });
console.log("server starting on :8080....");
console.log('{server}', {server})

async function requestHandler(req: Deno.RequestEvent) {
  const pathname = new URL(req.request.url).pathname
  if (isWebsocketRequest(pathname)) { // must be a CURL (or otherwise headless) request
    const { socket, response } = Deno.upgradeWebSocket(req.request);
    wsHandler(socket);
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
