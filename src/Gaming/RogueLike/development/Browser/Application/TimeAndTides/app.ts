import { Drash } from './deps.ts'

import LandingResource from './resources/Landing.ts'
import { StaticFilesResource } from './resources/_examples/static_files_resource.ts'

import { PrefixedExampleResource as v1PrefixedExampleResource } from './resources/_examples/prefixed/v1/prefix_resource.ts';
import { PrefixedExampleResource as v2PrefixedExampleResource } from './resources/_examples/prefixed/v2/prefix_resource.ts';

class HomeResource extends Drash.Resource {
  public paths = ["/home"];

  public GET(request: Drash.Request, response: Drash.Response): void {
    return response.json({
      hello: "world",
      time: new Date(),
    });
  }
}

// Create and run your server

const server = new Drash.Server({
  hostname: "0.0.0.0",
  port: 1447,
  protocol: "http",
  resources: [
    StaticFilesResource,
    LandingResource,
    HomeResource,
    v1PrefixedExampleResource,
    v2PrefixedExampleResource,
  ],
});

server.run();

console.log(`Server running at ${server.address}.`);
