import { Drash } from "../../deps.ts";

export class BodyParsingResource extends Drash.Resource {
  public paths = ['/bodyparse',];
  /*
      - VALID:
$ curl --header "Content-Type: application/json" --request POST \
--data '{"name":"deno","type":"json"}' http://localhost:1447/bodyparse
    - INVALID
$ curl --header "Content-Type: application/json" --request POST \
--data '{"username":"deno","type":"json"}' http://localhost:1447/bodyparse

    - VALID:
$ curl --header "Content-Type: application/x-www-form-urlencoded" --request POST \
--data 'name=deno&type=urlencoded' http://localhost:1447/bodyparse
    - INVALID
$ curl --header "Content-Type: application/x-www-form-urlencoded" --request POST \
--data 'username=deno&type=urlencoded' http://localhost:1447/bodyparse
*/

  public POST(request: Drash.Request, response: Drash.Response): void {
    const parseType = request.bodyParam('type')
    const param = request.bodyParam("name");
    // No param passed in? Get out.
    if (!param) { throw new Drash.Errors.HttpError( 400, "This resource requires the `name` body param.",) }
    return response.text(`You passed in the following body param: ${param} as ${parseType} data`);
  }
}