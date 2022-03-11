// deno run --allow-net --allow-read --allow-write app.ts # --allow-read is required for loading data from the public/static folder
// $ curl -X POST http://localhost:1447 
// $ curl -X PUT http://localhost:1447
// $ curl -X DELETE http://localhost:1447
import { Drash } from './deps.ts'

import { resources, ErrorHandler } from './resources/resources.ts'
import { PaladinService, LoggingService, srvRateLimit, srvResponseTime, srvTengine } from './services/services.ts'

// Create and run your server
const server = new Drash.Server({
  // cert_file: "/path/to/cert/file.crt", // <--- See here (also notice key_file is present and protocol is "https")
  error_handler: ErrorHandler,
  // key_file: "/path/to/cert/file.key",
  hostname: "0.0.0.0",
  port: 1313,
  protocol: "http",
  resources, // destructured from above
  services: [
    new LoggingService(), new PaladinService(),
    srvRateLimit, srvResponseTime, srvTengine,
  ],
});

server.run();

console.log(`Server running at ${server.address}.`);
