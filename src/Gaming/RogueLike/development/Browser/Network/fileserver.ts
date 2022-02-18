// deno run --allow-read --allow-net file_server.ts
import * as path from 'https://deno.land/std@0.123.0/path/mod.ts';
import { readableStreamFromReader } from 'https://deno.land/std@0.123.0/streams/mod.ts';

// Start listening on port 8080 of localhost.
const server = Deno.listen({ port:1313 });
console.log('File server running on http://localhost:1313/');

for await (const conn of server) {
  handleHttp(conn);
}

async function handleHttp(conn: Deno.Conn) {
  const httpConn = Deno.serveHttp(conn);
  for await (const requestEvent of httpConn) {
    // Use the request pathname as filepath
    const url = new URL(requestEvent.request.url);
    const filepath = decodeURIComponent(url.pathname);

    // Try opening the file
    let file;
    try {
      // console.log('../Application/rogue/ + filepath', '../Application/rogue' + filepath) // Debug
      file = await Deno.open('../Application/rogue/' + filepath, { read: true });
      const stat = await file.stat();

      // If File instance is a directory, lookup for an index.html
      if (stat.isDirectory) {
        file.close();
        const filePath = path.join('../Application/rogue/', filepath, 'index.html');
        file = await Deno.open(filePath, { read: true });
      }
    } catch {
      // If the file cannot be opened, return a '404 Not Found' response
      const notFoundResponse = new Response('404 Not Found', { status: 404 });
      await requestEvent.respondWith(notFoundResponse);
      return;
    }

    // Build a readable stream so the file doesn't have to be fully loaded into
    // memory while we send it
    const readableStream = readableStreamFromReader(file);

    // Build and send the response
    const response = new Response(readableStream);
    await requestEvent.respondWith(response);
  }
}