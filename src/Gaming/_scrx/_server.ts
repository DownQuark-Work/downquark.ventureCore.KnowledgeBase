// rule of thumb for this server:
// `.js` files are front-end only, vanilla, scripts
// `.mjs` files are vanilla `type="module"` scripts
// `.ts` are rendered server-side and more often than not will deliver their final payload as a json object to the `.mjs` modules.
// #############
// deno run --allow-read --allow-net --config ./deno.jsonc --watch _server.ts
// http://0.0.0.0:1313/src/rooms-and-corridors.html

console.log('DELETE the following line when finished development')
import * as _LIB from './src/_dq-lib/_lib-watch.ts' // using this for `--watch` only

const PORT = 1313
const server = Deno.listen({ port: PORT })
console.log(`server starting on :${PORT}....`)

async function requestHandler(req: Deno.RequestEvent) {
  const pathname = new URL(req.request.url).pathname
    
    // file-server
    let filepath = decodeURIComponent(pathname)
    filepath = filepath === '/' ? '/index.html' : filepath
    let file
    try {
      file = await Deno.open(('./' + filepath).replace('//','/'), { read: true })
    } catch {
      await req.respondWith(new Response('404 Not Found: ' + filepath, { status: 404 }))
      return
    }
    // https://deno.land/manual@v1.26.2/typescript/overview#supported-media-types
    const readableStream = file.readable // stream instead of wait for full load

    // SSR
    if(pathname?.split('/')?.at(-1)?.split('.').at(-1) === 'ts') {
      const params = '{"' + new URL(req.request.url).search.replace('?','').replace(/=/g,'":"').replace(/&/g,'","') + '"}'
      if(params !== '{""}') {
        // deno-lint-ignore no-explicit-any
        const ssrRespData = await import('./'+filepath) as any
        console.log('ssrRespData: ', ssrRespData)
        const ssrReturnResponse = ssrRespData.default(params)
        const jsModuleResp = new Response(`export const ServerResponse = ${ssrReturnResponse};`, { status: 200, headers: { 'content-type': 'text/javascript', }, })
        await req.respondWith(jsModuleResp)
        return
      }

      await req.respondWith(new Response(readableStream, { status: 200, headers: { 'content-type': 'text/javascript', }, }))
      return
    }

    const response = (pathname?.split('/')?.at(-1)?.split('.').at(-1) === 'mjs')
      ? new Response(readableStream, { status: 200, headers: { 'content-type': 'text/javascript', }, })
      : new Response(readableStream)
      
    await req.respondWith(response)
  }

for await (const conn of server) {
  (async () => {
    const httpConn = Deno.serveHttp(conn)
    for await (const requestEvent of httpConn) {
      requestHandler(requestEvent)
    }
  })()
}
