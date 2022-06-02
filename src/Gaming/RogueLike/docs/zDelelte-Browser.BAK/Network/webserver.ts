// deno run --allow-net webserver.ts
// Useful as an API server where only data is transmitted
import { serve } from 'https://deno.land/std@0.123.0/http/server.ts';

const port = 1113;

const handler = (request: Request): Response => {
  let body = 'Your user-agent is:\n\n';
  body += request.headers.get('user-agent') || 'Unknown';

  return new Response(body, { status: 200 });
};

console.log(`HTTP webserver running. Access it at: http://localhost:1313/`);
await serve(handler, { port });