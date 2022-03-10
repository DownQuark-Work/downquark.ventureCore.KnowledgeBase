// deno run --allow-net --allow-read --allow-write app.ts # --allow-read is required for loading data from the public/static folder
// $ curl -X POST http://localhost:1447 
// $ curl -X PUT http://localhost:1447
// $ curl -X DELETE http://localhost:1447
import { Drash, PaladinService } from './deps.ts'

import { DqErrorHandler } from './resources/error_handler.ts'

import LandingResource from './resources/Landing.ts'

import { BodyParsingResource } from './resources/_examples/requests.ts'
import { StaticFilesResource } from './resources/_examples/static_files_resource.ts'
import { PrefixedExampleResource as v1PrefixedExampleResource } from './resources/_examples/prefixed/v1/prefix_resource.ts';
import { PrefixedExampleResource as v2PrefixedExampleResource } from './resources/_examples/prefixed/v2/prefix_resource.ts';
import { ResponseResource } from './resources/_examples/responses.ts'
import { WebSocketResource } from './resources/_examples/web_socket.ts'

import { srvRateLimit, srvResponseTime } from './services/boilerplate.ts'

// Create and run your server
const server = new Drash.Server({
  // cert_file: "/path/to/cert/file.crt", // <--- See here (also notice key_file is present and protocol is "https")
  error_handler: DqErrorHandler,
  // key_file: "/path/to/cert/file.key",
  hostname: "0.0.0.0",
  port: 1447,
  protocol: "http",
  resources: [
    BodyParsingResource,
    LandingResource,
    ResponseResource,
    StaticFilesResource,
    v1PrefixedExampleResource,
    v2PrefixedExampleResource,
    WebSocketResource,
  ],
  services: [
    new PaladinService(),
    srvRateLimit,
    srvResponseTime,
  ],
});

server.run();

console.log(`Server running at ${server.address}.`);
