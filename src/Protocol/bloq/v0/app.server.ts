// import { PORT } from '../_utils/constants.ts'
// import { crypto, serve } from  '../deps.ts'
// // import { crypto, readAll, serve } from  '../deps.ts'
// import { apiRoutes } from './routes.ts'
// import { createGenesisBlock } from '../_v0/utils.bloqchain.ts'
// import { wsHandlerServer } from './utils.websocket.ts'

// const server = Deno.listen({ port: PORT })
// console.log(`server starting on :${PORT}....`)
// createGenesisBlock() // may as well as soon as the server spins up

// const isApiRequest = (pName:string):boolean => /^\/api\/v\d+\//i.test(pName)
// const isWebsocketRequest = (pName:string):boolean => /^\/ws\//i.test(pName)

// async function requestHandler(req: Deno.RequestEvent) {
//   const pathname = new URL(req.request.url).pathname
//   if (isWebsocketRequest(pathname)) { // pathname must begin with '/ws/'
//     const { socket, response } = Deno.upgradeWebSocket(req.request)
//     wsHandlerServer(socket)
//     req.respondWith(response)
//   }
//   else if (isApiRequest(pathname)) // pathname must begin with '/api/v#/'
//     { // example usage: `$ curl http://localhost:8080/api/v0/blocks`
//       const apiParts = pathname.split('/')
//       apiParts.splice(0,3); console.log('apiParts', apiParts, '\n\n NOTE: api response should be available in secondary terminal window')
//       try {
//         const apiData = apiParts[1] ? JSON.parse(atob(apiParts[1])) : null
//         await req.respondWith( new Response(apiRoutes[req.request.method][apiParts[0]](apiData), { status: 200, headers: { 'content-type': 'text/html', }, }), )
//       } catch {
//         req.respondWith(new Response('Invalid API Request', { status: 500 }))
//       }
//     }
//   else { // file-server
//     let filepath = decodeURIComponent(pathname)
//     filepath = filepath === '/' ? '/index.html' : filepath
//     let file
//     try {
//       file = await Deno.open('./ui/' + filepath, { read: true })
//     } catch {
//       await req.respondWith(new Response('404 Not Found', { status: 404 }))
//       return
//     }
//     const readableStream = file.readable // stream instead of wait for full load
//     const response = new Response(readableStream)// Build and send the response
//     await req.respondWith(response)
//   }
// }

// for await (const conn of server) {
//   (async () => {
//     const httpConn = Deno.serveHttp(conn)
//     for await (const requestEvent of httpConn) {
//       requestHandler(requestEvent)
//     }
//   })()
// }
