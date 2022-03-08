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

    if(parseType === 'multipartform') {
      // RUN With Writeability and the uploaded file will be copied into the `_public` directory
        // deno run --allow-net --allow-read --allow-write app.ts
      const file = request.bodyParam<Drash.Types.BodyFile>("file"); // "file" being the `name` of the input element
      const name = request.bodyParam<string>("name");
      console.log("Got name and file!", file, name);
      if (!file) {
        throw new Error("File is required!");
      }
      return Deno.writeFileSync(`_public/${file.filename}`, file.content);
    }

    const param = request.bodyParam("name");
    // No param passed in? Get out.
    if (!param) { throw new Drash.Errors.HttpError( 400, "This resource requires the `name` body param.",) }
    return response.text(`You passed in the following body param: ${param} as ${parseType} data`);
  }

  // used for multipart form updates
  public GET(request: Drash.Request, response: Drash.Response): void {
    // for query param example navigate to:
      // http://0.0.0.0:1447/bodyparse?q=🤓
    console.log('request.queryParam("name")', request.queryParam("q"))
    return response.html(
      `<!DOCTYPE html>
        <html>
            <head></head>
            <body>
                <form action="/bodyparse" method="post" enctype="multipart/form-data">
                    <input type="file" name="file" />
                    <input name="name" type="text" />
                    <input name="type" value="multipartform" type="hidden" />
                    <button type="submit">submit</button>
                </form>
            </body>
        </html>`,
    );
  }
}