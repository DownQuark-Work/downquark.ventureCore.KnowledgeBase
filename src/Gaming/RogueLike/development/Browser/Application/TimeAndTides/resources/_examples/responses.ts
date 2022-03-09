import { DrashResponse } from "https://deno.land/x/drash@v2.5.4/src/http/response.ts";
import { Drash } from "../../deps.ts";

export class ResponseResource extends Drash.Resource {
  public paths = ['/respond',];

  public GET(request: Drash.Request, response: Drash.Response): void {
    const resType = request.queryParam("type")
    /**
     * CALLABLE BY VISITING (IN BROWSER)
     * http://0.0.0.0:1447/respond?type=download
     * http://0.0.0.0:1447/respond?type=file
     * http://0.0.0.0:1447/respond?type=html
     * http://0.0.0.0:1447/respond?type=json
     * http://0.0.0.0:1447/respond?type=text
     * http://0.0.0.0:1447/respond?type=xml
     */

    if(resType === 'download') {
      return response.download(
        "./_public/Left Leg.png", // Relative to the current working directory that executed the entrypoint script
        "image/png", // The content type of the file (used to set the Content-Type header on the response)
      );    
    }
    
    const html = Deno.readFileSync("./_public/tst.html");  // or return response.html("<div>Hello, world!</div>");
    const xml = Deno.readFileSync("./_public/tst.xml");  // or return response.xml("<body>Hello, world!</body>");
    const respContent:{[k:string]:any} = {
      file: "./_public/tst.txt", // Relative to the current working directory that executed the entrypoint script
      html,
      json: { hello: "world" },
      text: "Hello world",
      xml,
    }
    if(resType) {
      const rT = resType as keyof typeof response
      return typeof response[rT] === 'function' ? (response[rT] as CallableFunction)(respContent[resType]) : null
    }
  }
}

  // public POST(request: Drash.Request, response: Drash.Response): void {
  //   const parseType = request.bodyParam('type')
  //   const qookieValue = request.getCookie("qookie");

  //   if (qookieValue) {
  //     console.log('qookieValue', qookieValue)
  //   }

  //   if(parseType === 'multipartform') {
  //     // RUN With Writeability and the uploaded file will be copied into the `_public` directory
  //       // deno run --allow-net --allow-read --allow-write app.ts
  //     const file = request.bodyParam<Drash.Types.BodyFile>("file"); // "file" being the `name` of the input element
  //     const name = request.bodyParam<string>("name");
  //     console.log("Got name and file!", file, name);
  //     if (!file) {
  //       throw new Error("File is required!");
  //     }
  //     return Deno.writeFileSync(`_public/${file.filename}`, file.content);
  //   }

  //   const param = request.bodyParam("name");
  //   // No param passed in? Get out.
  //   if (!param) { throw new Drash.Errors.HttpError( 400, "This resource requires the `name` body param.",) }
  //   return response.text(`You passed in the following body param: ${param} as ${parseType} data`);
  // }