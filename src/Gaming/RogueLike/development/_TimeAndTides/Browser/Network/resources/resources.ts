export { ErrorHandler } from './error_handler.ts'

import LandingResource from './landing.ts'

import { BodyParsingResource } from './_examples/requests.ts'
import { ExampleResource } from './_examples/examples.ts'
import { PrefixedExampleResource as v1PrefixedExampleResource } from './_examples/prefixed/v1/prefix_resource.ts';
import { PrefixedExampleResource as v2PrefixedExampleResource } from './_examples/prefixed/v2/prefix_resource.ts';
import { ResponseResource } from './_examples/responses.ts'
import { StaticFilesResource } from './_examples/static_files_resource.ts'
import { WebSocketResource } from './_examples/web_socket.ts'

export const resources = [
  LandingResource,
  BodyParsingResource,
  ExampleResource,
  v1PrefixedExampleResource,
  v2PrefixedExampleResource,
  ResponseResource,
  StaticFilesResource,
  WebSocketResource,
]